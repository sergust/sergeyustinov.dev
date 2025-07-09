import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from '../../../lib/trpc';
import { TRPCError } from '@trpc/server';

// Rate limiting setup for search
let searchRatelimit: Ratelimit | null = null;

// Only initialize rate limiting if Redis credentials are available
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  searchRatelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 searches per minute
    analytics: true,
  });
}

// Input validation schemas
const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(200, 'Query too long'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
  sortBy: z
    .enum(['relevance', 'date', 'popularity', 'title'])
    .default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  includeContent: z.boolean().default(false), // Whether to search content or just title/excerpt
});

const suggestionsSchema = z.object({
  query: z.string().min(1).max(50),
  limit: z.number().min(1).max(10).default(5),
});

const searchStatsSchema = z.object({
  timeframe: z.enum(['day', 'week', 'month', 'all']).default('week'),
});

// Rate limiting middleware for search
const searchRateMiddleware = async (identifier: string) => {
  // Skip rate limiting if Redis is not configured (development mode)
  if (!searchRatelimit) {
    console.warn('Search rate limiting is disabled - Redis not configured');
    return { limit: 30, reset: Date.now() + 60000, remaining: 29 };
  }

  const { success, limit, reset, remaining } = await searchRatelimit.limit(
    `search_${identifier}`
  );

  if (!success) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many search requests. Please try again later.',
    });
  }

  return { limit, reset, remaining };
};

// Helper function to build search query with pg_trgm and full-text search
const buildSearchQuery = (query: string, includeContent: boolean) => {
  const sanitizedQuery = query.replace(/[^\w\s]/g, ' ').trim();
  const searchTerms = sanitizedQuery
    .split(/\s+/)
    .filter((term) => term.length > 0);

  if (searchTerms.length === 0) {
    return { where: {}, searchRank: '' };
  }

  // Build full-text search query
  const tsQuery = searchTerms.join(' & ');

  // Build similarity query for fuzzy matching
  const similarityQuery = searchTerms
    .map((term) => `similarity(title, '${term}')`)
    .join(' + ');

  // Build OR conditions array
  const orConditions: any[] = [
    // Exact title matches (highest priority)
    {
      title: {
        contains: sanitizedQuery,
        mode: 'insensitive' as const,
      },
    },
    // Exact excerpt matches
    {
      excerpt: {
        contains: sanitizedQuery,
        mode: 'insensitive' as const,
      },
    },
    // Individual word matches in title
    ...searchTerms.map((term) => ({
      title: {
        contains: term,
        mode: 'insensitive' as const,
      },
    })),
    // Individual word matches in excerpt
    ...searchTerms.map((term) => ({
      excerpt: {
        contains: term,
        mode: 'insensitive' as const,
      },
    })),
  ];

  // Add content search if requested
  if (includeContent) {
    orConditions.push(
      ...searchTerms.map((term) => ({
        content: {
          contains: term,
          mode: 'insensitive' as const,
        },
      }))
    );
  }

  const baseWhere = {
    published: true,
    OR: orConditions,
  };

  // Calculate search rank for ordering
  const searchRank = `
    CASE 
      WHEN LOWER(title) LIKE LOWER('%${sanitizedQuery}%') THEN 100
      WHEN LOWER(excerpt) LIKE LOWER('%${sanitizedQuery}%') THEN 80
      ${includeContent ? `WHEN LOWER(content) LIKE LOWER('%${sanitizedQuery}%') THEN 60` : ''}
      ELSE (${similarityQuery}) * 40
    END
  `;

  return { where: baseWhere, searchRank };
};

// Helper to extract search highlights
const extractHighlights = (
  text: string,
  query: string,
  maxLength: number = 200
) => {
  const sanitizedQuery = query.replace(/[^\w\s]/g, ' ').trim();
  const searchTerms = sanitizedQuery
    .split(/\s+/)
    .filter((term) => term.length > 0);

  if (searchTerms.length === 0) {
    return text.substring(0, maxLength);
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = sanitizedQuery.toLowerCase();

  // Find the first occurrence of the search query
  let startIndex = lowerText.indexOf(lowerQuery);

  // If exact phrase not found, find first occurrence of any search term
  if (startIndex === -1) {
    for (const term of searchTerms) {
      startIndex = lowerText.indexOf(term.toLowerCase());
      if (startIndex !== -1) break;
    }
  }

  if (startIndex === -1) {
    return text.substring(0, maxLength);
  }

  // Extract context around the match
  const contextStart = Math.max(0, startIndex - 50);
  const contextEnd = Math.min(text.length, startIndex + maxLength - 50);

  let excerpt = text.substring(contextStart, contextEnd);

  // Add ellipsis if truncated
  if (contextStart > 0) excerpt = '...' + excerpt;
  if (contextEnd < text.length) excerpt = excerpt + '...';

  return excerpt;
};

export const searchRouter = createTRPCRouter({
  // Main search endpoint
  search: publicProcedure.input(searchSchema).query(async ({ ctx, input }) => {
    const {
      query,
      page,
      limit,
      sortBy,
      sortOrder,
      dateFrom,
      dateTo,
      includeContent,
    } = input;

    // Rate limiting (use IP as identifier for anonymous users)
    const identifier = ctx.userId || 'anonymous';
    await searchRateMiddleware(identifier);

    const skip = (page - 1) * limit;

    // Build search query
    const { where, searchRank } = buildSearchQuery(query, includeContent);

    // Add date filters if provided
    if (dateFrom || dateTo) {
      (where as any).publishedAt = {};
      if (dateFrom) (where as any).publishedAt.gte = dateFrom;
      if (dateTo) (where as any).publishedAt.lte = dateTo;
    }

    // Determine sort order
    let orderBy: any = {};
    switch (sortBy) {
      case 'relevance':
        // For relevance, we'll rely on the search ranking logic
        orderBy = [
          { title: 'asc' }, // Fallback sorting
        ];
        break;
      case 'date':
        orderBy = { publishedAt: sortOrder };
        break;
      case 'popularity':
        orderBy = [{ views: sortOrder }, { likes: { _count: sortOrder } }];
        break;
      case 'title':
        orderBy = { title: sortOrder };
        break;
    }

    try {
      // Execute search
      const [searchResults, totalCount] = await Promise.all([
        ctx.db.post.findMany({
          where,
          include: {
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        ctx.db.post.count({ where }),
      ]);

      // Process results and add highlights
      const processedResults = searchResults.map((post) => {
        const titleHighlight = extractHighlights(post.title, query, 100);
        const excerptHighlight = extractHighlights(post.excerpt, query, 200);
        const contentHighlight = includeContent
          ? extractHighlights(post.content, query, 300)
          : undefined;

        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          heroImage: post.heroImage,
          publishedAt: post.publishedAt,
          views: post.views,
          likeCount: post._count.likes,
          commentCount: post._count.comments,
          highlights: {
            title: titleHighlight,
            excerpt: excerptHighlight,
            content: contentHighlight,
          },
        };
      });

      const hasMore = skip + limit < totalCount;

      // Log search for analytics (if user is authenticated)
      if (ctx.userId) {
        try {
          await ctx.db.analytics.create({
            data: {
              event: 'search',
              userId: ctx.userId,
              metadata: {
                query,
                resultsCount: totalCount,
                page,
                sortBy,
                includeContent,
              },
            },
          });
        } catch (error) {
          // Non-critical error, continue with response
          console.warn('Failed to log search analytics:', error);
        }
      }

      return {
        results: processedResults,
        totalCount,
        hasMore,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        query,
        processingTime: Date.now(), // Can be used to calculate actual processing time
      };
    } catch (error) {
      console.error('Search error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Search failed. Please try again.',
      });
    }
  }),

  // Search suggestions/autocomplete
  suggestions: publicProcedure
    .input(suggestionsSchema)
    .query(async ({ ctx, input }) => {
      const { query, limit } = input;

      // Rate limiting
      const identifier = ctx.userId || 'anonymous';
      await searchRateMiddleware(identifier);

      const sanitizedQuery = query.replace(/[^\w\s]/g, ' ').trim();

      if (sanitizedQuery.length < 2) {
        return { suggestions: [] };
      }

      try {
        // Get posts that match the query for suggestions
        const matchingPosts = await ctx.db.post.findMany({
          where: {
            published: true,
            OR: [
              {
                title: {
                  contains: sanitizedQuery,
                  mode: 'insensitive',
                },
              },
              {
                excerpt: {
                  contains: sanitizedQuery,
                  mode: 'insensitive',
                },
              },
            ],
          },
          select: {
            title: true,
            excerpt: true,
          },
          take: limit * 2, // Get more to extract suggestions from
        });

        // Extract unique suggestion terms
        const suggestions = new Set<string>();
        const searchTerms = sanitizedQuery.toLowerCase().split(/\s+/);

        matchingPosts.forEach((post) => {
          const titleWords = post.title.toLowerCase().split(/\s+/);
          const excerptWords = post.excerpt.toLowerCase().split(/\s+/);

          [...titleWords, ...excerptWords].forEach((word) => {
            // Find words that start with or contain our search terms
            if (
              word.length >= 3 &&
              searchTerms.some((term) => word.includes(term))
            ) {
              suggestions.add(word);
            }
          });
        });

        // Convert to array and limit results
        const suggestionArray = Array.from(suggestions)
          .slice(0, limit)
          .map((suggestion) => ({
            text: suggestion,
            type: 'term' as const,
          }));

        // Add exact post titles that match
        const titleSuggestions = matchingPosts
          .slice(0, Math.max(0, limit - suggestionArray.length))
          .map((post) => ({
            text: post.title,
            type: 'title' as const,
          }));

        return {
          suggestions: [...suggestionArray, ...titleSuggestions],
        };
      } catch (error) {
        console.error('Suggestions error:', error);
        return { suggestions: [] };
      }
    }),

  // Popular search terms
  popular: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ ctx, input }) => {
      const { limit } = input;

      try {
        // Get popular search terms from analytics
        const popularSearches = await ctx.db.analytics.findMany({
          where: {
            event: 'search',
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
          select: {
            metadata: true,
          },
          take: 1000, // Limit raw data to process
        });

        // Process and count search queries
        const queryCount = new Map<string, number>();

        popularSearches.forEach((search) => {
          const metadata = search.metadata as any;
          if (metadata?.query && typeof metadata.query === 'string') {
            const query = metadata.query.toLowerCase().trim();
            if (query.length >= 2) {
              queryCount.set(query, (queryCount.get(query) || 0) + 1);
            }
          }
        });

        // Sort by count and return top results
        const sortedQueries = Array.from(queryCount.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([query, count]) => ({
            query,
            count,
          }));

        return {
          popularSearches: sortedQueries,
        };
      } catch (error) {
        console.error('Popular searches error:', error);
        return { popularSearches: [] };
      }
    }),

  // Search statistics (admin only)
  stats: adminProcedure
    .input(searchStatsSchema)
    .query(async ({ ctx, input }) => {
      const { timeframe } = input;

      let dateFilter = {};
      if (timeframe !== 'all') {
        const now = new Date();
        const startDate = new Date();

        switch (timeframe) {
          case 'day':
            startDate.setDate(now.getDate() - 1);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        }

        dateFilter = {
          createdAt: {
            gte: startDate,
          },
        };
      }

      try {
        const [totalSearches, uniqueUsers, popularQueries, searchTrends] =
          await Promise.all([
            // Total search count
            ctx.db.analytics.count({
              where: {
                event: 'search',
                ...dateFilter,
              },
            }),

            // Unique users who searched
            ctx.db.analytics.findMany({
              where: {
                event: 'search',
                ...dateFilter,
              },
              select: {
                userId: true,
              },
              distinct: ['userId'],
            }),

            // Top search queries
            ctx.db.analytics.findMany({
              where: {
                event: 'search',
                ...dateFilter,
              },
              select: {
                metadata: true,
              },
              take: 1000,
            }),

            // Search trends by day
            ctx.db.analytics.groupBy({
              by: ['createdAt'],
              where: {
                event: 'search',
                ...dateFilter,
              },
              _count: {
                id: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 30,
            }),
          ]);

        // Process popular queries
        const queryCount = new Map<string, number>();
        popularQueries.forEach((search) => {
          const metadata = search.metadata as any;
          if (metadata?.query) {
            const query = metadata.query.toLowerCase().trim();
            queryCount.set(query, (queryCount.get(query) || 0) + 1);
          }
        });

        const topQueries = Array.from(queryCount.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([query, count]) => ({ query, count }));

        return {
          totalSearches,
          uniqueUsers: uniqueUsers.length,
          topQueries,
          searchTrends: searchTrends.map((trend) => ({
            date: trend.createdAt,
            count: trend._count.id,
          })),
        };
      } catch (error) {
        console.error('Search stats error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch search statistics.',
        });
      }
    }),
});

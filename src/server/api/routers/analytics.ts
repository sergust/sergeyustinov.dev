import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from '../../../lib/trpc';
import { TRPCError } from '@trpc/server';

// Rate limiting setup for analytics
let analyticsRatelimit: Ratelimit | null = null;

// Only initialize rate limiting if Redis credentials are available
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  analyticsRatelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 events per minute per user
    analytics: true,
  });
}

// Input validation schemas
const trackEventSchema = z.object({
  event: z.enum([
    'page_view',
    'post_view',
    'like',
    'comment',
    'subscribe',
    'search',
    'download',
    'share',
    'click',
  ]),
  postId: z.string().cuid().optional(),
  metadata: z.record(z.any()).optional(),
});

const getStatsSchema = z.object({
  timeframe: z
    .enum(['1h', '24h', '7d', '30d', '90d', '1y', 'all'])
    .default('30d'),
  events: z.array(z.string()).optional(),
  postId: z.string().cuid().optional(),
  groupBy: z.enum(['event', 'date', 'post', 'user', 'referrer']).optional(),
});

const getPopularContentSchema = z.object({
  timeframe: z.enum(['24h', '7d', '30d', '90d', '1y', 'all']).default('30d'),
  limit: z.number().min(1).max(100).default(10),
  event: z
    .enum(['page_view', 'post_view', 'like', 'comment'])
    .default('post_view'),
});

const getTrafficSourcesSchema = z.object({
  timeframe: z.enum(['24h', '7d', '30d', '90d', '1y', 'all']).default('30d'),
  limit: z.number().min(1).max(50).default(20),
});

// Rate limiting middleware for analytics
const analyticsRateMiddleware = async (identifier: string) => {
  // Skip rate limiting if Redis is not configured (development mode)
  if (!analyticsRatelimit) {
    console.warn('Analytics rate limiting is disabled - Redis not configured');
    return { limit: 100, reset: Date.now() + 60000, remaining: 99 };
  }

  const { success, limit, reset, remaining } = await analyticsRatelimit.limit(
    `analytics_${identifier}`
  );

  if (!success) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many analytics events. Please slow down.',
    });
  }

  return { limit, reset, remaining };
};

// Helper function to extract user agent info
const parseUserAgent = (userAgent: string) => {
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent);

  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';

  return { isMobile, isBot, browser };
};

// Helper function to get IP address from request
const getClientIp = (req: any) => {
  return (
    req?.headers.get('x-forwarded-for')?.split(',')[0] ||
    req?.headers.get('x-real-ip') ||
    req?.headers.get('cf-connecting-ip') ||
    'unknown'
  );
};

// Helper function to calculate date ranges
const getDateRange = (timeframe: string) => {
  const now = new Date();
  let startDate: Date;

  switch (timeframe) {
    case '1h':
      startDate = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
      startDate = new Date('2020-01-01');
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return { startDate, endDate: now };
};

export const analyticsRouter = createTRPCRouter({
  // Track an event (public, lightweight, async)
  track: publicProcedure
    .input(trackEventSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { event, postId, metadata } = input;

        // Get client info
        const identifier =
          ctx.req?.headers.get('x-forwarded-for')?.split(',')[0] ||
          ctx.req?.headers.get('x-real-ip') ||
          ctx.userId ||
          'anonymous';

        // Rate limiting check
        await analyticsRateMiddleware(identifier);

        // Extract request information
        const userAgent = ctx.req?.headers.get('user-agent') || '';
        const referrer = ctx.req?.headers.get('referer') || '';
        const ipAddress = getClientIp(ctx.req);
        const userAgentInfo = parseUserAgent(userAgent);

        // Skip bot traffic in production
        if (userAgentInfo.isBot && process.env.NODE_ENV === 'production') {
          return { success: true, message: 'Bot traffic ignored' };
        }

        // Enhanced metadata
        const enrichedMetadata = {
          ...metadata,
          ...userAgentInfo,
          timestamp: new Date().toISOString(),
          source: metadata?.source || 'web',
        };

        // Async analytics tracking (fire and forget for performance)
        setImmediate(async () => {
          try {
            await ctx.db.analytics.create({
              data: {
                event,
                postId,
                userId: ctx.userId,
                userAgent: userAgent.slice(0, 500), // Limit length
                ipAddress: ipAddress.slice(0, 45), // IPv6 max length
                referrer: referrer.slice(0, 500), // Limit length
                metadata: enrichedMetadata,
              },
            });
          } catch (error) {
            console.error('Analytics tracking failed:', error);
          }
        });

        return { success: true };
      } catch (error) {
        // Don't fail the main request if analytics fails
        console.error('Analytics error:', error);
        return { success: false, message: 'Analytics tracking failed' };
      }
    }),

  // Batch track multiple events (for performance)
  trackBatch: publicProcedure
    .input(z.object({ events: z.array(trackEventSchema).max(20) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { events } = input;

        const identifier =
          ctx.req?.headers.get('x-forwarded-for')?.split(',')[0] ||
          ctx.req?.headers.get('x-real-ip') ||
          ctx.userId ||
          'anonymous';

        // Rate limiting check
        await analyticsRateMiddleware(identifier);

        // Extract request information once
        const userAgent = ctx.req?.headers.get('user-agent') || '';
        const referrer = ctx.req?.headers.get('referer') || '';
        const ipAddress = getClientIp(ctx.req);
        const userAgentInfo = parseUserAgent(userAgent);

        // Skip bot traffic in production
        if (userAgentInfo.isBot && process.env.NODE_ENV === 'production') {
          return { success: true, message: 'Bot traffic ignored' };
        }

        // Async batch analytics tracking
        setImmediate(async () => {
          try {
            const analyticsData = events.map(({ event, postId, metadata }) => ({
              event,
              postId,
              userId: ctx.userId,
              userAgent: userAgent.slice(0, 500),
              ipAddress: ipAddress.slice(0, 45),
              referrer: referrer.slice(0, 500),
              metadata: {
                ...metadata,
                ...userAgentInfo,
                timestamp: new Date().toISOString(),
                source: metadata?.source || 'web',
              },
            }));

            await ctx.db.analytics.createMany({
              data: analyticsData,
              skipDuplicates: true,
            });
          } catch (error) {
            console.error('Batch analytics tracking failed:', error);
          }
        });

        return { success: true, processed: events.length };
      } catch (error) {
        console.error('Batch analytics error:', error);
        return { success: false, message: 'Batch analytics tracking failed' };
      }
    }),

  // Get analytics statistics (admin only)
  getStats: adminProcedure
    .input(getStatsSchema)
    .query(async ({ input, ctx }) => {
      const { timeframe, events, postId, groupBy } = input;
      const { startDate, endDate } = getDateRange(timeframe);

      // Build where clause
      const where: any = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };

      if (events && events.length > 0) {
        where.event = { in: events };
      }

      if (postId) {
        where.postId = postId;
      }

      try {
        const [totalEvents, uniqueUsers, topEvents, hourlyData] =
          await Promise.all([
            // Total events count
            ctx.db.analytics.count({ where }),

            // Unique users count
            ctx.db.analytics.groupBy({
              by: ['userId'],
              where: {
                ...where,
                userId: { not: null },
              },
              _count: { userId: true },
            }),

            // Top events
            ctx.db.analytics.groupBy({
              by: ['event'],
              where,
              _count: { event: true },
              orderBy: { _count: { event: 'desc' } },
              take: 10,
            }),

            // Hourly breakdown for recent data
            timeframe === '24h'
              ? ctx.db.analytics.groupBy({
                  by: ['createdAt'],
                  where,
                  _count: { createdAt: true },
                })
              : null,
          ]);

        const stats: {
          totalEvents: number;
          uniqueUsers: number;
          topEvents: { event: string; count: number }[];
          timeframe: string;
          dateRange: { startDate: Date; endDate: Date };
          hourlyBreakdown?: Record<number, number>;
        } = {
          totalEvents,
          uniqueUsers: uniqueUsers.length,
          topEvents: topEvents.map((item) => ({
            event: item.event,
            count: item._count.event,
          })),
          timeframe,
          dateRange: { startDate, endDate },
        };

        if (hourlyData) {
          // Group by hour for 24h view
          const hourlyStats = hourlyData.reduce(
            (acc, item) => {
              const hour = new Date(item.createdAt).getHours();
              acc[hour] = (acc[hour] || 0) + item._count.createdAt;
              return acc;
            },
            {} as Record<number, number>
          );

          stats.hourlyBreakdown = hourlyStats;
        }

        return stats;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch analytics statistics',
        });
      }
    }),

  // Get popular content (admin only)
  getPopularContent: adminProcedure
    .input(getPopularContentSchema)
    .query(async ({ input, ctx }) => {
      const { timeframe, limit, event } = input;
      const { startDate, endDate } = getDateRange(timeframe);

      try {
        const popularContent = await ctx.db.analytics.groupBy({
          by: ['postId'],
          where: {
            event,
            postId: { not: null },
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          _count: { postId: true },
          orderBy: { _count: { postId: 'desc' } },
          take: limit,
        });

        // Get post details for the popular content
        const postIds = popularContent.map((item) => item.postId!);
        const posts = await ctx.db.post.findMany({
          where: { id: { in: postIds } },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            publishedAt: true,
            views: true,
          },
        });

        // Combine analytics data with post details
        const result = popularContent.map((item) => {
          const post = posts.find((p) => p.id === item.postId);
          return {
            postId: item.postId,
            count: item._count.postId,
            post: post || null,
          };
        });

        return {
          content: result,
          timeframe,
          event,
          total: popularContent.length,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch popular content',
        });
      }
    }),

  // Get traffic sources (admin only)
  getTrafficSources: adminProcedure
    .input(getTrafficSourcesSchema)
    .query(async ({ input, ctx }) => {
      const { timeframe, limit } = input;
      const { startDate, endDate } = getDateRange(timeframe);

      try {
        const trafficSources = await ctx.db.analytics.groupBy({
          by: ['referrer'],
          where: {
            event: 'page_view',
            referrer: { not: null },
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          _count: { referrer: true },
          orderBy: { _count: { referrer: 'desc' } },
          take: limit,
        });

        // Process and categorize referrers
        const categorizedSources = trafficSources.map((item) => {
          const referrer = item.referrer || '';
          let category = 'Other';
          let domain = '';

          try {
            const url = new URL(referrer);
            domain = url.hostname;

            if (domain.includes('google.com')) category = 'Google';
            else if (domain.includes('twitter.com') || domain.includes('x.com'))
              category = 'Twitter';
            else if (domain.includes('linkedin.com')) category = 'LinkedIn';
            else if (domain.includes('facebook.com')) category = 'Facebook';
            else if (domain.includes('github.com')) category = 'GitHub';
            else if (domain.includes('dev.to')) category = 'Dev.to';
            else if (domain.includes('hashnode.com')) category = 'Hashnode';
            else category = 'External';
          } catch {
            category = referrer ? 'Direct' : 'Unknown';
          }

          return {
            referrer: referrer || 'Direct',
            domain,
            category,
            count: item._count.referrer,
          };
        });

        return {
          sources: categorizedSources,
          timeframe,
          total: trafficSources.length,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch traffic sources',
        });
      }
    }),

  // Get real-time analytics (admin only)
  getRealtime: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    try {
      const [currentActiveUsers, recentEvents, topPages] = await Promise.all([
        // Active users in last 5 minutes
        ctx.db.analytics.groupBy({
          by: ['userId'],
          where: {
            createdAt: { gte: fiveMinutesAgo },
            userId: { not: null },
          },
          _count: { userId: true },
        }),

        // Recent events in last hour
        ctx.db.analytics.findMany({
          where: {
            createdAt: { gte: oneHourAgo },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        }),

        // Top pages in last hour
        ctx.db.analytics.groupBy({
          by: ['postId'],
          where: {
            event: 'post_view',
            postId: { not: null },
            createdAt: { gte: oneHourAgo },
          },
          _count: { postId: true },
          orderBy: { _count: { postId: 'desc' } },
          take: 10,
        }),
      ]);

      // Get post data for recent events
      const postIds = recentEvents
        .filter((event) => event.postId)
        .map((event) => event.postId!)
        .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates

      const posts =
        postIds.length > 0
          ? await ctx.db.post.findMany({
              where: { id: { in: postIds } },
              select: {
                id: true,
                title: true,
                slug: true,
              },
            })
          : [];

      return {
        activeUsers: currentActiveUsers.length,
        recentEvents: recentEvents.map((event) => {
          const post = posts.find((p) => p.id === event.postId);
          return {
            id: event.id,
            event: event.event,
            postId: event.postId,
            postTitle: post?.title,
            postSlug: post?.slug,
            createdAt: event.createdAt,
            userAgent: event.userAgent,
            referrer: event.referrer,
          };
        }),
        topPages: topPages.map((item) => ({
          postId: item.postId,
          views: item._count.postId,
        })),
        timestamp: now,
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch real-time analytics',
      });
    }
  }),

  // Clean up old analytics data (admin only)
  cleanup: adminProcedure
    .input(
      z.object({
        olderThan: z.enum(['30d', '90d', '1y', '2y']).default('1y'),
        dryRun: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { olderThan, dryRun } = input;
      const { startDate } = getDateRange(olderThan);

      try {
        if (dryRun) {
          // Count what would be deleted
          const count = await ctx.db.analytics.count({
            where: {
              createdAt: { lt: startDate },
            },
          });

          return {
            success: true,
            message: `Would delete ${count} analytics records older than ${olderThan}`,
            deleted: 0,
            dryRun: true,
          };
        }

        // Actually delete old records
        const result = await ctx.db.analytics.deleteMany({
          where: {
            createdAt: { lt: startDate },
          },
        });

        return {
          success: true,
          message: `Deleted ${result.count} analytics records older than ${olderThan}`,
          deleted: result.count,
          dryRun: false,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to cleanup analytics data',
        });
      }
    }),
});

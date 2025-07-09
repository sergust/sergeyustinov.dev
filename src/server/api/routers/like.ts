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
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Rate limiting setup for likes
let likeRatelimit: Ratelimit | null = null;

// Only initialize rate limiting if Redis credentials are available
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  likeRatelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 likes per minute
    analytics: true,
  });
}

// Input validation schemas
const toggleLikeSchema = z.object({
  postId: z.string().cuid('Invalid post ID'),
});

const getLikeStatusSchema = z.object({
  postId: z.string().cuid('Invalid post ID'),
});

const getLikeCountSchema = z.object({
  postId: z.string().cuid('Invalid post ID'),
});

const getUserLikesSchema = z.object({
  userId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Rate limiting middleware for likes
const likeRateMiddleware = async (
  identifier: string,
  action: string = 'like'
) => {
  // Skip rate limiting if Redis is not configured (development mode)
  if (!likeRatelimit) {
    console.warn('Like rate limiting is disabled - Redis not configured');
    return { limit: 20, reset: Date.now() + 60000, remaining: 19 };
  }

  const { success, limit, reset, remaining } = await likeRatelimit.limit(
    `${action}_${identifier}`
  );

  if (!success) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Too many ${action} requests. Please try again later.`,
    });
  }

  return { limit, reset, remaining };
};

export const likeRouter = createTRPCRouter({
  // Toggle like/unlike for a post
  toggle: protectedProcedure
    .input(toggleLikeSchema)
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const userId = ctx.userId!;

      // Rate limiting check
      await likeRateMiddleware(userId, 'like');

      // Check if post exists and is published
      const post = await ctx.db.post.findUnique({
        where: { id: postId },
        select: { published: true },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      if (!post.published) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot like unpublished posts',
        });
      }

      // Check if user has already liked this post
      const existingLike = await ctx.db.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (existingLike) {
        // Unlike: Remove the like
        await ctx.db.like.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });

        // Get updated like count
        const likeCount = await ctx.db.like.count({
          where: { postId },
        });

        return {
          action: 'unliked' as const,
          likeCount,
          isLiked: false,
        };
      } else {
        // Like: Create a new like
        try {
          await ctx.db.like.create({
            data: {
              userId,
              postId,
            },
          });

          // Get updated like count
          const likeCount = await ctx.db.like.count({
            where: { postId },
          });

          return {
            action: 'liked' as const,
            likeCount,
            isLiked: true,
          };
        } catch (error) {
          // Handle race condition where like was created between our check and create
          if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2002'
          ) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'You have already liked this post',
            });
          }
          throw error;
        }
      }
    }),

  // Get like status for a post (for the current user)
  getStatus: publicProcedure
    .input(getLikeStatusSchema)
    .query(async ({ ctx, input }) => {
      const { postId } = input;
      const userId = ctx.userId;

      // Check if post exists and is published
      const post = await ctx.db.post.findUnique({
        where: { id: postId },
        select: { published: true },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      if (!post.published) {
        return {
          isLiked: false,
          likeCount: 0,
        };
      }

      // Get like count and user's like status in parallel
      const [likeCount, userLike] = await Promise.all([
        ctx.db.like.count({
          where: { postId },
        }),
        userId
          ? ctx.db.like.findUnique({
              where: {
                userId_postId: {
                  userId,
                  postId,
                },
              },
            })
          : null,
      ]);

      return {
        isLiked: !!userLike,
        likeCount,
      };
    }),

  // Get like count for a post
  getCount: publicProcedure
    .input(getLikeCountSchema)
    .query(async ({ ctx, input }) => {
      const { postId } = input;

      // Check if post exists and is published
      const post = await ctx.db.post.findUnique({
        where: { id: postId },
        select: { published: true },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      if (!post.published) {
        return { likeCount: 0 };
      }

      const likeCount = await ctx.db.like.count({
        where: { postId },
      });

      return { likeCount };
    }),

  // Get user's likes (with pagination)
  getUserLikes: publicProcedure
    .input(getUserLikesSchema)
    .query(async ({ ctx, input }) => {
      const { userId, page, limit } = input;
      const skip = (page - 1) * limit;

      // If no userId provided, use current user (if authenticated)
      const targetUserId = userId || ctx.userId;

      if (!targetUserId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID is required',
        });
      }

      // Get likes with post information
      const [likes, totalCount] = await Promise.all([
        ctx.db.like.findMany({
          where: {
            userId: targetUserId,
            post: {
              published: true,
            },
          },
          include: {
            post: {
              select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                heroImage: true,
                publishedAt: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        ctx.db.like.count({
          where: {
            userId: targetUserId,
            post: {
              published: true,
            },
          },
        }),
      ]);

      const hasMore = skip + limit < totalCount;

      return {
        likes,
        totalCount,
        hasMore,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),

  // Get most liked posts
  getMostLiked: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        timeframe: z.enum(['day', 'week', 'month', 'all']).default('all'),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, timeframe } = input;

      let createdAtFilter = {};
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

        createdAtFilter = {
          createdAt: {
            gte: startDate,
          },
        };
      }

      // Get posts with their like counts
      const postsWithLikes = await ctx.db.post.findMany({
        where: {
          published: true,
          likes: {
            some: createdAtFilter,
          },
        },
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: {
          likes: {
            _count: 'desc',
          },
        },
        take: limit,
      });

      return postsWithLikes.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        heroImage: post.heroImage,
        publishedAt: post.publishedAt,
        likeCount: post._count.likes,
      }));
    }),

  // Get like statistics (admin only)
  stats: adminProcedure.query(async ({ ctx }) => {
    const [
      totalLikes,
      likesToday,
      likesThisWeek,
      likesThisMonth,
      topLikedPosts,
    ] = await Promise.all([
      ctx.db.like.count(),
      ctx.db.like.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      ctx.db.like.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),
      ctx.db.like.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      }),
      ctx.db.post.findMany({
        where: { published: true },
        include: {
          _count: {
            select: { likes: true },
          },
        },
        orderBy: {
          likes: {
            _count: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    return {
      totalLikes,
      likesToday,
      likesThisWeek,
      likesThisMonth,
      topLikedPosts: topLikedPosts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        likeCount: post._count.likes,
      })),
    };
  }),
});

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

// Rate limiting setup
let ratelimit: Ratelimit | null = null;

// Only initialize rate limiting if Redis credentials are available
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
    analytics: true,
  });
}

// Input validation schemas
const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(2000, 'Comment is too long'),
  postId: z.string().cuid('Invalid post ID'),
  authorName: z.string().min(1, 'Author name is required').max(100),
  authorEmail: z.string().email('Invalid email format').max(255),
  parentId: z.string().cuid('Invalid parent comment ID').optional(),
});

const updateCommentSchema = z.object({
  id: z.string().cuid('Invalid comment ID'),
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(2000, 'Comment is too long'),
});

const deleteCommentSchema = z.object({
  id: z.string().cuid('Invalid comment ID'),
});

const getCommentsSchema = z.object({
  postId: z.string().cuid('Invalid post ID'),
  parentId: z.string().cuid('Invalid parent comment ID').optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});

// Rate limiting middleware
const rateLimitMiddleware = async (
  identifier: string,
  action: string = 'comment'
) => {
  // Skip rate limiting if Redis is not configured (development mode)
  if (!ratelimit) {
    console.warn('Rate limiting is disabled - Redis not configured');
    return { limit: 5, reset: Date.now() + 60000, remaining: 4 };
  }

  const { success, limit, reset, remaining } = await ratelimit.limit(
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

// Spam detection helper
const detectSpam = (content: string): boolean => {
  const spamPatterns = [
    /(.)\1{10,}/i, // Repeated characters
    /(https?:\/\/[^\s]+){3,}/i, // Multiple URLs
    /(\b\w+\b.*?){50,}/i, // Extremely long content
    /\b(buy|sell|cheap|discount|offer|click here|free|winner|congratulations)\b.*?\b(now|today|limited|urgent)\b/i, // Spam keywords
  ];

  return spamPatterns.some((pattern) => pattern.test(content));
};

export const commentRouter = createTRPCRouter({
  // Get comments for a specific post
  getByPost: publicProcedure
    .input(getCommentsSchema)
    .query(async ({ ctx, input }) => {
      const { postId, parentId, page, limit } = input;
      const skip = (page - 1) * limit;

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
          message: 'Comments are not available for unpublished posts',
        });
      }

      const [comments, totalCount] = await Promise.all([
        ctx.db.comment.findMany({
          where: {
            postId,
            parentId: parentId || null,
          },
          include: {
            replies: {
              orderBy: { createdAt: 'asc' },
              take: 5, // Show first 5 replies
            },
            _count: {
              select: { replies: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        ctx.db.comment.count({
          where: {
            postId,
            parentId: parentId || null,
          },
        }),
      ]);

      const hasMore = skip + limit < totalCount;

      return {
        comments,
        totalCount,
        hasMore,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),

  // Create a new comment
  create: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const { postId, content, authorName, authorEmail, parentId } = input;

      // Rate limiting check
      await rateLimitMiddleware(ctx.userId!, 'comment');

      // Spam detection
      if (detectSpam(content)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Comment detected as spam. Please revise your content.',
        });
      }

      // Verify post exists and is published
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
          message: 'Cannot comment on unpublished posts',
        });
      }

      // Verify parent comment exists if specified
      if (parentId) {
        const parentComment = await ctx.db.comment.findUnique({
          where: { id: parentId },
          select: { postId: true },
        });

        if (!parentComment) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Parent comment not found',
          });
        }

        if (parentComment.postId !== postId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Parent comment must be from the same post',
          });
        }
      }

      // Create the comment
      const comment = await ctx.db.comment.create({
        data: {
          content,
          postId,
          authorId: ctx.userId!,
          authorName,
          authorEmail,
          parentId: parentId || null,
        },
        include: {
          replies: {
            orderBy: { createdAt: 'asc' },
            take: 5,
          },
          _count: {
            select: { replies: true },
          },
        },
      });

      return comment;
    }),

  // Update comment (only by author or admin)
  update: protectedProcedure
    .input(updateCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, content } = input;

      // Rate limiting check
      await rateLimitMiddleware(ctx.userId!, 'comment_update');

      // Spam detection
      if (detectSpam(content)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Comment detected as spam. Please revise your content.',
        });
      }

      // Check if comment exists
      const existingComment = await ctx.db.comment.findUnique({
        where: { id },
        select: { authorId: true },
      });

      if (!existingComment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found',
        });
      }

      // Check permissions (author or admin)
      if (existingComment.authorId !== ctx.userId && !ctx.isAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only edit your own comments',
        });
      }

      // Update the comment
      const updatedComment = await ctx.db.comment.update({
        where: { id },
        data: { content },
        include: {
          replies: {
            orderBy: { createdAt: 'asc' },
            take: 5,
          },
          _count: {
            select: { replies: true },
          },
        },
      });

      return updatedComment;
    }),

  // Delete comment (only by author or admin)
  delete: protectedProcedure
    .input(deleteCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Check if comment exists
      const existingComment = await ctx.db.comment.findUnique({
        where: { id },
        select: { authorId: true },
      });

      if (!existingComment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found',
        });
      }

      // Check permissions (author or admin)
      if (existingComment.authorId !== ctx.userId && !ctx.isAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only delete your own comments',
        });
      }

      // Delete the comment (cascade will handle replies)
      await ctx.db.comment.delete({
        where: { id },
      });

      return { success: true };
    }),

  // Get comment statistics (admin only)
  stats: adminProcedure.query(async ({ ctx }) => {
    const [totalComments, commentsToday, topCommenters] = await Promise.all([
      ctx.db.comment.count(),
      ctx.db.comment.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      ctx.db.comment.groupBy({
        by: ['authorId', 'authorName'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    return {
      totalComments,
      commentsToday,
      topCommenters: topCommenters.map((item) => ({
        authorId: item.authorId,
        authorName: item.authorName,
        commentCount: item._count.id,
      })),
    };
  }),

  // Admin: Moderate comments
  moderate: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        action: z.enum(['approve', 'reject', 'flag']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, action } = input;

      const comment = await ctx.db.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found',
        });
      }

      // For now, we'll just delete flagged/rejected comments
      // In a more complex system, you might add a status field
      if (action === 'reject') {
        await ctx.db.comment.delete({
          where: { id },
        });
        return { success: true, action: 'deleted' };
      }

      return { success: true, action };
    }),
});

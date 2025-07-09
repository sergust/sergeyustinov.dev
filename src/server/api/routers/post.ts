import { z } from 'zod';
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from '../../../lib/trpc';
import { TRPCError } from '@trpc/server';

// Input validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().min(1, 'Slug is required').max(100),
  heroImage: z.string().url().optional(),
  published: z.boolean().default(false),
  publishedAt: z.date().optional(),
});

const updatePostSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(200).optional(),
  excerpt: z.string().min(1, 'Excerpt is required').max(500).optional(),
  content: z.string().min(1, 'Content is required').optional(),
  slug: z.string().min(1, 'Slug is required').max(100).optional(),
  heroImage: z.string().url().optional(),
  published: z.boolean().optional(),
  publishedAt: z.date().optional(),
});

const postFiltersSchema = z.object({
  published: z.boolean().optional(),
  authorId: z.string().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z
    .enum(['createdAt', 'publishedAt', 'title', 'views'])
    .default('publishedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const postRouter = createTRPCRouter({
  // Get all posts (with pagination and filters)
  list: publicProcedure
    .input(
      z.object({
        filters: postFiltersSchema.optional(),
        pagination: paginationSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { filters = {}, pagination } = input;
      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 10;
      const sortBy = pagination?.sortBy ?? 'publishedAt';
      const sortOrder = pagination?.sortOrder ?? 'desc';

      const skip = (page - 1) * limit;

      // Build where clause
      const where = {
        ...(filters.published !== undefined && {
          published: filters.published,
        }),
        ...(filters.authorId && { authorId: filters.authorId }),
        ...(filters.search && {
          OR: [
            {
              title: { contains: filters.search, mode: 'insensitive' as const },
            },
            {
              excerpt: {
                contains: filters.search,
                mode: 'insensitive' as const,
              },
            },
            {
              content: {
                contains: filters.search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }),
      };

      // Execute queries in parallel
      const [posts, totalCount] = await Promise.all([
        ctx.db.post.findMany({
          where,
          include: {
            likes: true,
            comments: {
              where: { parentId: null },
              orderBy: { createdAt: 'desc' },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: limit,
        }),
        ctx.db.post.count({ where }),
      ]);

      const hasMore = skip + limit < totalCount;

      return {
        posts,
        totalCount,
        hasMore,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),

  // Get single post by slug
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { slug: input.slug },
        include: {
          likes: true,
          comments: {
            include: {
              replies: {
                orderBy: { createdAt: 'asc' },
              },
            },
            where: { parentId: null },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Increment view count
      await ctx.db.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      });

      return post;
    }),

  // Get post by ID (for admin)
  byId: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        include: {
          likes: true,
          comments: {
            include: {
              replies: {
                orderBy: { createdAt: 'asc' },
              },
            },
            where: { parentId: null },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      return post;
    }),

  // Create new post
  create: adminProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if slug already exists
      const existingPost = await ctx.db.post.findUnique({
        where: { slug: input.slug },
      });

      if (existingPost) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A post with this slug already exists',
        });
      }

      const post = await ctx.db.post.create({
        data: {
          title: input.title,
          excerpt: input.excerpt,
          content: input.content,
          slug: input.slug,
          heroImage: input.heroImage || null,
          published: input.published,
          publishedAt: input.published ? input.publishedAt || new Date() : null,
          authorId: ctx.userId!,
        },
        include: {
          likes: true,
          comments: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      return post;
    }),

  // Update post
  update: adminProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Check if post exists
      const existingPost = await ctx.db.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Check if slug already exists (if updating slug)
      if (input.slug && input.slug !== existingPost.slug) {
        const slugExists = await ctx.db.post.findUnique({
          where: { slug: input.slug },
        });

        if (slugExists) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A post with this slug already exists',
          });
        }
      }

      // Handle publishedAt logic
      let publishedAt = updateData.publishedAt;
      if (updateData.published !== undefined) {
        if (updateData.published && !existingPost.published) {
          // Publishing for the first time
          publishedAt = updateData.publishedAt || new Date();
        } else if (!updateData.published) {
          // Unpublishing
          publishedAt = undefined;
        }
      }

      // Filter out undefined values for Prisma
      const prismaUpdateData = Object.fromEntries(
        Object.entries({
          ...updateData,
          publishedAt,
        }).filter(([, value]) => value !== undefined)
      );

      const post = await ctx.db.post.update({
        where: { id },
        data: prismaUpdateData,
        include: {
          likes: true,
          comments: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      return post;
    }),

  // Delete post
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      await ctx.db.post.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Get post statistics
  stats: adminProcedure.query(async ({ ctx }) => {
    const [totalPosts, publishedPosts, totalViews, totalLikes, totalComments] =
      await Promise.all([
        ctx.db.post.count(),
        ctx.db.post.count({ where: { published: true } }),
        ctx.db.post.aggregate({
          _sum: { views: true },
        }),
        ctx.db.like.count(),
        ctx.db.comment.count(),
      ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalViews: totalViews._sum.views || 0,
      totalLikes,
      totalComments,
    };
  }),
});

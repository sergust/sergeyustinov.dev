import { z } from 'zod';
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from '../../../lib/trpc';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { TRPCError } from '@trpc/server';

// Initialize Redis rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(10, '1 m'), // 10 subscriptions per minute
  analytics: true,
  prefix: 'subscriber:ratelimit',
});

// Email validation schema
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email must be less than 255 characters')
  .toLowerCase()
  .trim();

// Subscription input schema
const subscribeSchema = z.object({
  email: emailSchema,
  name: z
    .string()
    .optional()
    .transform((name) => name?.trim() || null),
  source: z
    .string()
    .optional()
    .transform((source) => source?.trim() || null),
});

// Update subscriber schema
const updateSubscriberSchema = z.object({
  id: z.string().cuid(),
  email: emailSchema.optional(),
  name: z
    .string()
    .optional()
    .transform((name) => name?.trim() || null),
  isActive: z.boolean().optional(),
});

// Email validation helper
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Check for disposable email domains
const disposableEmailDomains = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'temp-mail.org',
  'throwaway.email',
  'yopmail.com',
  'tempmail.plus',
  'emailtemp.info',
  'tempmail.ninja',
];

const isDisposableEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return disposableEmailDomains.includes(domain || '');
};

export const subscriberRouter = createTRPCRouter({
  // Subscribe to newsletter
  subscribe: publicProcedure
    .input(subscribeSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Rate limiting
        const identifier =
          ctx.req?.headers.get('x-forwarded-for')?.split(',')[0] ||
          ctx.req?.headers.get('x-real-ip') ||
          ctx.userId ||
          'anonymous';
        const ratelimitResult = await ratelimit.limit(identifier);

        if (!ratelimitResult.success) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many subscription attempts. Please try again later.',
          });
        }

        const { email, name, source } = input;

        // Additional email validation
        if (!validateEmail(email)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid email format',
          });
        }

        // Check for disposable email
        if (isDisposableEmail(email)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Disposable email addresses are not allowed',
          });
        }

        // Check if email already exists
        const existingSubscriber = await ctx.db.subscriber.findUnique({
          where: { email },
        });

        if (existingSubscriber) {
          // If inactive, reactivate
          if (!existingSubscriber.isActive) {
            const updated = await ctx.db.subscriber.update({
              where: { email },
              data: {
                isActive: true,
                name: name || existingSubscriber.name,
                source: source || existingSubscriber.source,
              },
            });
            return {
              success: true,
              message: 'Subscription reactivated!',
              subscriber: updated,
            };
          }

          // Already active
          return {
            success: true,
            message: 'Already subscribed!',
            subscriber: existingSubscriber,
          };
        }

        // Create new subscriber
        const subscriber = await ctx.db.subscriber.create({
          data: {
            email,
            name,
            source,
          },
        });

        return {
          success: true,
          message: 'Successfully subscribed!',
          subscriber,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to subscribe',
        });
      }
    }),

  // Unsubscribe from newsletter
  unsubscribe: publicProcedure
    .input(z.object({ email: emailSchema }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { email } = input;

        const subscriber = await ctx.db.subscriber.findUnique({
          where: { email },
        });

        if (!subscriber) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Email not found in subscription list',
          });
        }

        if (!subscriber.isActive) {
          return { success: true, message: 'Already unsubscribed' };
        }

        await ctx.db.subscriber.update({
          where: { email },
          data: { isActive: false },
        });

        return { success: true, message: 'Successfully unsubscribed' };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to unsubscribe',
        });
      }
    }),

  // Get subscription status
  getStatus: publicProcedure
    .input(z.object({ email: emailSchema }))
    .query(async ({ input, ctx }) => {
      const { email } = input;

      const subscriber = await ctx.db.subscriber.findUnique({
        where: { email },
      });

      return {
        subscribed: subscriber ? subscriber.isActive : false,
        subscribedAt: subscriber?.subscribedAt,
      };
    }),

  // Get all subscribers (admin only)
  getAll: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
        search: z.string().optional(),
        isActive: z.boolean().optional(),
        sortBy: z
          .enum(['email', 'name', 'subscribedAt'])
          .default('subscribedAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, search, isActive, sortBy, sortOrder } = input;
      const offset = (page - 1) * limit;

      const where: any = {};

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [subscribers, total] = await Promise.all([
        ctx.db.subscriber.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip: offset,
          take: limit,
        }),
        ctx.db.subscriber.count({ where }),
      ]);

      return {
        subscribers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Update subscriber (admin only)
  update: adminProcedure
    .input(updateSubscriberSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input;

      try {
        const subscriber = await ctx.db.subscriber.findUnique({
          where: { id },
        });

        if (!subscriber) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Subscriber not found',
          });
        }

        // Check for email uniqueness if updating email
        if (updates.email && updates.email !== subscriber.email) {
          const existingSubscriber = await ctx.db.subscriber.findUnique({
            where: { email: updates.email },
          });

          if (existingSubscriber) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Email already exists',
            });
          }

          // Validate new email
          if (!validateEmail(updates.email)) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Invalid email format',
            });
          }

          if (isDisposableEmail(updates.email)) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Disposable email addresses are not allowed',
            });
          }
        }

        const updated = await ctx.db.subscriber.update({
          where: { id },
          data: updates,
        });

        return { success: true, subscriber: updated };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update subscriber',
        });
      }
    }),

  // Delete subscriber (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      try {
        const subscriber = await ctx.db.subscriber.findUnique({
          where: { id },
        });

        if (!subscriber) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Subscriber not found',
          });
        }

        await ctx.db.subscriber.delete({
          where: { id },
        });

        return { success: true, message: 'Subscriber deleted successfully' };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete subscriber',
        });
      }
    }),

  // Get subscriber statistics (admin only)
  getStats: adminProcedure
    .input(
      z.object({
        timeframe: z.enum(['7d', '30d', '90d', '1y', 'all']).default('30d'),
      })
    )
    .query(async ({ input, ctx }) => {
      const { timeframe } = input;

      // Calculate date range
      const now = new Date();
      let startDate: Date | undefined;

      switch (timeframe) {
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
          startDate = undefined;
          break;
      }

      const whereClause = startDate ? { subscribedAt: { gte: startDate } } : {};

      const [
        totalSubscribers,
        activeSubscribers,
        inactiveSubscribers,
        newSubscribers,
        subscribersBySource,
      ] = await Promise.all([
        ctx.db.subscriber.count(),
        ctx.db.subscriber.count({ where: { isActive: true } }),
        ctx.db.subscriber.count({ where: { isActive: false } }),
        ctx.db.subscriber.count({ where: whereClause }),
        ctx.db.subscriber.groupBy({
          by: ['source'],
          where: whereClause,
          _count: { _all: true },
        }),
      ]);

      return {
        totalSubscribers,
        activeSubscribers,
        inactiveSubscribers,
        newSubscribers,
        subscribersBySource: subscribersBySource.map((item) => ({
          source: item.source || 'unknown',
          count: item._count._all,
        })),
        conversionRate:
          totalSubscribers > 0
            ? (activeSubscribers / totalSubscribers) * 100
            : 0,
        timeframe,
      };
    }),

  // Export subscribers (admin only)
  export: adminProcedure
    .input(
      z.object({
        format: z.enum(['csv', 'json']).default('csv'),
        activeOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      const { format, activeOnly } = input;

      const where = activeOnly ? { isActive: true } : {};

      const subscribers = await ctx.db.subscriber.findMany({
        where,
        select: {
          email: true,
          name: true,
          subscribedAt: true,
          isActive: true,
          source: true,
        },
        orderBy: { subscribedAt: 'desc' },
      });

      if (format === 'json') {
        return {
          format: 'json',
          data: subscribers,
          count: subscribers.length,
        };
      }

      // Generate CSV
      const csvHeader = 'Email,Name,Subscribed At,Status,Source\n';
      const csvRows = subscribers
        .map(
          (sub) =>
            `"${sub.email}","${sub.name || ''}","${sub.subscribedAt.toISOString()}","${sub.isActive ? 'Active' : 'Inactive'}","${sub.source || ''}"`
        )
        .join('\n');

      return {
        format: 'csv',
        data: csvHeader + csvRows,
        count: subscribers.length,
      };
    }),
});

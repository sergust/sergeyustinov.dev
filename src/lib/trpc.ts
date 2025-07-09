import { initTRPC, TRPCError } from '@trpc/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from './db';
import { ZodError } from 'zod';
import superjson from 'superjson';

// Create context for tRPC
export const createTRPCContext = async () => {
  const user = await currentUser();

  return {
    db,
    user,
    userId: user?.id,
    isAdmin:
      user?.publicMetadata?.role === 'admin' ||
      user?.emailAddresses?.[0]?.emailAddress === 'sergey@sergeyustinov.dev',
  };
};

// Initialize tRPC
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Base router and procedures
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure (requires authentication)
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Admin procedure (requires admin role)
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  if (!ctx.isAdmin) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

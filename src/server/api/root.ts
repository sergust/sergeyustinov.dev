import { createTRPCRouter } from '../../lib/trpc';
import { postRouter } from './routers/post';
import { commentRouter } from './routers/comment';
import { likeRouter } from './routers/like';
import { searchRouter } from './routers/search';
import { subscriberRouter } from './routers/subscriber';
import { analyticsRouter } from './routers/analytics';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  comment: commentRouter,
  like: likeRouter,
  search: searchRouter,
  subscriber: subscriberRouter,
  analytics: analyticsRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

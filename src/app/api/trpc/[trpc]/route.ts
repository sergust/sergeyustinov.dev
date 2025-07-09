import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';
import { appRouter } from '../../../../server/api/root';
import { createTRPCContext } from '../../../../lib/trpc';

const handler = (req: NextRequest) => {
  const options: Parameters<typeof fetchRequestHandler>[0] = {
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  };

  if (process.env.NODE_ENV === 'development') {
    options.onError = ({ path, error }) => {
      console.error(
        `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
      );
    };
  }

  return fetchRequestHandler(options);
};

export { handler as GET, handler as POST };

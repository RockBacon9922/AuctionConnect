import { authRouter } from "./router/auth";
import { bidRouter } from "./router/bid";
import { lotRouter } from "./router/lot";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  lot: lotRouter,
  bid: bidRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

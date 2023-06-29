import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const bidRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.bid.findMany({ orderBy: { id: "desc" } });
  }),
  byLot: publicProcedure
    .input(z.object({ lotId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.bid.findMany({ where: { lotId: input.lotId } });
    }),
  create: publicProcedure
    .input(
      z.object({
        lotId: z.number(),
        price: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bid.create({ data: input });
    }),
});

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const lotRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.lot.findMany({ orderBy: { id: "desc" } });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.lot.findFirst({ where: { id: input.id } });
    }),
  byStatus: publicProcedure
    .input(z.object({ status: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.lot.findMany({ where: { status: input.status } });
    }),
});

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const lotRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.lot.findMany({ orderBy: { id: "asc" } });
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
  setStatusAll: publicProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.lot.updateMany({
        data: { status: input.status },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        image: z.string(),
        lowEstimate: z.number(),
        highEstimate: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.lot.create({
        data: {
          name: input.name,
          description: input.description,
          image: input.image,
          lowEstimate: input.lowEstimate,
          highEstimate: input.highEstimate,
          asking: input.lowEstimate,
          status: "upcoming",
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.lot.delete({ where: { id: input.id } });
    }),
  current: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.lot.findFirst({
      where: { status: "live" },
      include: {
        Bid: {
          orderBy: { time: "desc" },
        },
      },
      orderBy: { id: "asc" },
    });
  }),
  updateAsk: publicProcedure
    .input(z.object({ id: z.number(), asking: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.lot.update({
        where: { id: input.id },
        data: { asking: input.asking },
      });
    }),
});

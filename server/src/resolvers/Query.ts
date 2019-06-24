import { Context } from '../types';
import { LinkWhereUniqueInput } from '../generated/prisma-client';

export const feed = (root: any, args: null, context: Context) =>
  context.prisma.links();

export const link = (
  parent: null, args: LinkWhereUniqueInput, context: Context,
) => {
  return context.prisma.link({
    id: args.id,
  });
};

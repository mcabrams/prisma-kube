import { Context } from '@src/types';
import { LinkWhereUniqueInput } from '@src/generated/prisma-client';

export const feed = (root: any, args: null, context: Context) =>
  context.prisma.links();

export const link = (
  parent: null, args: LinkWhereUniqueInput, context: Context,
) => {
  return context.prisma.link({
    id: args.id,
  });
};

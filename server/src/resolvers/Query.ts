import { Context } from '@src/types';
import { LinkWhereUniqueInput } from '@src/generated/prisma-client';

export const feed = async (
  root: any, args: {filter?: string;}, context: Context,
) => {
  const where = args.filter ? {
    OR: [
      {description_contains: args.filter},
      {url_contains: args.filter},
    ],
  } : {};
  const links = await context.prisma.links({
    where,
  });
  return links;
}

export const link = (
  parent: null, args: LinkWhereUniqueInput, context: Context,
) => {
  return context.prisma.link({
    id: args.id,
  });
};

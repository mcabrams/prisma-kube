import { Context } from '@src/types';
import { LinkWhereUniqueInput } from '@src/generated/prisma-client';

type FeedArgs = {
  filter?: string;
  skip?: number;
  first?: number;
}

export const feed = async (root: any, args: FeedArgs, context: Context) => {
  const where = args.filter ? {
    OR: [
      {description_contains: args.filter},
      {url_contains: args.filter},
    ],
  } : {};
  const links = await context.prisma.links({
    where,
    first: args.first,
    skip: args.skip,
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

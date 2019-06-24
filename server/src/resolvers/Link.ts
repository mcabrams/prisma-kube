import { Link } from '../generated/prisma-client';
import { Context } from '../types';

export const postedBy = (parent: Link, args: null, context: Context) => {
  return context.prisma.link({ id: parent.id }).postedBy();
};

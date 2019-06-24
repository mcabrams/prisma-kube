import { User } from '../generated/prisma-client';
import { Context } from '../types';

export const links = (parent: User, args: null, context: Context) => {
  return context.prisma.user({ id: parent.id }).links();
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  LinkCreateInput, LinkUpdateInput, User, UserCreateWithoutLinksInput,
} from '../generated/prisma-client';
import { Context } from '../types';
import { APP_SECRET, getUserId } from '../utils';

export const signup = async (
  parent: any, args: UserCreateWithoutLinksInput, context: Context,
) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({
    ...args,
    password,
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

export const login = async (
  parent: any, args: Pick<User, 'email' | 'password'>, context: Context,
) => {
  const user = await context.prisma.user({ email: args.email });

  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

export const post = (
  parent: any, args: LinkCreateInput, context: Context,
) => {
  const userId = getUserId(context);

  return context.prisma.createLink({
    ...args,
    postedBy: {
      connect: {
        id: userId,
      },
    },
  });
};

export const updateLink = (
  parent: any, args: {id: string;} & LinkUpdateInput, context: Context,
) => {
  const userId = getUserId(context);
  const { id, ...updatedLinkArgs } = args;

  return context.prisma.updateLink({
    data: updatedLinkArgs,
    where: {
      id,
    },
  });
};

export const deleteLink = (
  parent: null, args: { id: string }, context: Context,
) => {
  return context.prisma.deleteLink({
    id: args.id,
  });
}
import { importSchema } from 'graphql-import'
import { makeExecutableSchema } from 'graphql-tools'
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import compression from 'compression';
import { prisma } from './generated/prisma-client';

type Link = {
  id: string;
  description: string;
  url: string;
}

const typeDefs = importSchema(__dirname + '/schema.graphql');

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'hi!',
    feed: (root: any, args: any, context: any, info: any) => {
      return context.prisma.links();
    },
    link: (parent: null, args: Pick<Link, 'id'>, context: any) => {
      return context.prisma.link({
        id: args.id,
      });
    }
  },
  Mutation: {
    post: (
      root: any,
      { description, url }: Pick<Link, 'description' | 'url'>,
      context: any,
    ) => {
      return context.prisma.createLink({
        description,
        url,
      });
    },
    updateLink: (
      parent: null,
      args: { id: string, url?: string, description?: string },
      context: any,
    ) => {
      const { id, ...updatedLinkArgs } = args;

      return context.prisma.updateLink({
        data: updatedLinkArgs,
        where: {
          id,
        },
      });
    },
    deleteLink: (
      parent: null,
      args: { id: string },
      context: any,
    ) => {
      return context.prisma.deleteLink({
        id: args.id,
      });
    }
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({
  schema,
  context: { prisma },
});

const app = express();
server.applyMiddleware({ app });
app.use(compression());
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

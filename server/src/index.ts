import { importSchema } from 'graphql-import'
import { makeExecutableSchema } from 'graphql-tools'
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import compression from 'compression';

import * as Query from './resolvers/Query';
import * as Mutation from './resolvers/Mutation';
import * as Link from './resolvers/Link';
import * as User from './resolvers/User';
import { Context } from './types';
// TODO: Not sure why absolute path does not work here
import { prisma } from './generated/prisma-client';

type Link = {
  id: string;
  description: string;
  url: string;
}

const typeDefs = importSchema(__dirname + '/schema.graphql');

// Provide resolver functions for your schema fields
const resolvers = {
  Query,
  Mutation,
  Link,
  User,
};

const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({
  schema,
  context: request => {
    return {
      ...request,
      prisma,
    };
  },
});

const app = express();
server.applyMiddleware({ app });
app.use(compression());
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

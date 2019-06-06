import { importSchema } from 'graphql-import'
import { makeExecutableSchema } from 'graphql-tools'
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import compression from 'compression';

let links = [{
  id: 'link-0',
  url: 'foo.com',
  description: 'hi',
}];

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
    feed: () => links,
  },
  Link: {
    id: (parent: Link) => parent.id,
    description: (parent: Link) => parent.description,
    url: (parent: Link) => parent.url,
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({
  schema,
});

const app = express();
server.applyMiddleware({ app });
app.use(compression());
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

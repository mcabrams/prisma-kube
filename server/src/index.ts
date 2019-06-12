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

let idCount = links.length;

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
    link: (parent: null, args: Pick<Link, 'id'>) => {
      return links.find(link => link.id === args.id);
    }
  },
  Mutation: {
    post: (
      parent: null,
      { description, url }: Pick<Link, 'description' | 'url'>,
    ) => {
      const link = {
        description,
        url,
        id: `link-${idCount++}`
      };
      links.push(link);
      return link;
    },
    updateLink: (
      parent: null,
      args: { id: string, url?: string, description?: string },
    ) => {
      const link = links.find(link => link.id === args.id);
      if (!link) {
        return;
      }
      const { id, ...updatedLinkArgs } = args;
      const updatedLink = { ...link, ...updatedLinkArgs };
      links = links.filter(link => link.id !== args.id);
      links.push(updatedLink);
      return updatedLink;
    },
    deleteLink: (
      parent: null,
      args: { id: string },
    ) => {
      const link = links.find(link => link.id === args.id);
      if (!link) {
        return;
      }
      links = links.filter(link => link.id !== args.id);
      return link;
    }
  },
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

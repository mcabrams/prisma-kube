import React from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import { Link } from '@src/components/Link';
import { Link as LinkType } from '@src/types';

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        url
        description
      }
    }
  }
`

interface Data {
  feed: {
    links: Array<LinkType>;
  };
};

interface LinkListProps {}

export const LinkList: React.SFC<LinkListProps> = props => {
  const linksToRender = [
    {
      id: '1',
      description: 'Prisma turns your database into a GraphQL API 😎',
      url: 'https://www.prismagraphql.com',
    },
    {
      id: '2',
      description: 'The best GraphQL client',
      url: 'https://www.apollographql.com/docs/react/',
    },
  ];

  return (
    <Query<Data> query={FEED_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <div>Fetching</div>;
        if (error) return <div>Error</div>;
        if (!data) return <div>No data</div>;

        const linksToRender = data.feed.links;

        return (
          <div>
            {linksToRender.map(link => <Link key={link.id} link={link} />)}
          </div>
        );
      }}
    </Query>
  )
};

import gql from 'graphql-tag';

export const FeedQuery = gql`
  query LinkList {
    feed {
      links {
        ...LinkInfo
      }
    }
  }
  fragment LinkInfo on Link {
    id
    createdAt
    description
    url
    votes {
      id
    }
    postedBy {
      id
      name
    }
  }
`;

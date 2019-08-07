import gql from 'graphql-tag';

export const FeedSearchQuery = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        ...LinkSearchInfo
      }
    }
  }
  fragment LinkSearchInfo on Link {
    id
    url
    description
    createdAt
    postedBy {
      id
      name
    }
    votes {
      id
      user {
        id
      }
    }
  }
`;

import gql from 'graphql-tag';

export const FEED_SEARCH_QUERY = gql`
  query FeedSearch($filter: String!) {
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

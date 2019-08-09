import gql from 'graphql-tag';

export const FeedQuery = gql`
  query LinkList($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        ...LinkInfo
      }
      count
    }
  }
  fragment LinkInfo on Link {
    id
    createdAt
    description
    url
    votes {
      id
      user {
        id
      }
    }
    postedBy {
      id
      name
    }
  }
`;

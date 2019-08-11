import gql from 'graphql-tag';

export const NEW_LINKS_SUBSCRIPTION = gql`
  subscription NewLinks {
    newLink {
      ...LinkFragment
    }
  }
  fragment LinkFragment on Link {
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

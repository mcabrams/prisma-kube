import gql from 'graphql-tag';

export const NewLinksSubscription = gql`
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

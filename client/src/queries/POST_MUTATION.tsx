import gql from 'graphql-tag';

export const POST_MUTATION = gql`
  mutation Post($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      ...PostResponse
    }
  }
  fragment PostResponse on Link {
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

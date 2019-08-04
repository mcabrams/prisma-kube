import gql from "graphql-tag";

export const PostMutation = gql`
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
    }
    postedBy {
      name
    }
  }
`;

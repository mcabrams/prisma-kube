import gql from "graphql-tag";

export const VoteMutation = gql`
  mutation Vote($linkId: ID!) {
    vote(linkId: $linkId) {
      ...VoteResponse
    }
  }
  fragment VoteResponse on Vote {
    id
    link {
      votes {
        id
        user {
          id
        }
      }
    }
    user {
      id
    }
  }
`;

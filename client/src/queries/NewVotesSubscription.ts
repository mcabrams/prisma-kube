import gql from 'graphql-tag';

export const NewVotesSubscription = gql`
  subscription NewVotes {
    newVote {
      ...NewVoteFragment
    }
  }
  fragment NewVoteFragment on Vote {
    id
    link {
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
    user {
      id
    }
  }
`;


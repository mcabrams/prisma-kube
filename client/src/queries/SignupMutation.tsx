import gql from 'graphql-tag';

export const SignupMutation = gql`
  mutation Signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      ...SignupResponse
    }
  }

  fragment SignupResponse on AuthPayload {
    token
  }
`;

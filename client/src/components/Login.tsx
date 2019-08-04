import React, { useState } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { RouteComponentProps } from 'react-router-dom';

import { getAuthToken, setAuthToken } from '@src/helpers/auth';
import {
  LoginComponent,
  LoginMutation,
  SignupComponent,
  SignupMutation,
} from '@src/generated/graphql';

interface LoginProps {}

const saveUserData = (token: string) => setAuthToken(token);

export const Login: React.FC<RouteComponentProps<LoginProps>> = props => {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const confirmLogin = async (data: LoginMutation) => {

    /* TODO: Starting here, these should raise errors */
    if (!data.login) {
      return;
    }
    if (data.login.__typename !== 'AuthPayload') {
      return;
    }
    const { token } = data.login;
    if (!token) {
      return;
    }
    /* TODO: Ending here, these should raise errors */

    saveUserData(token);
    props.history.push('/');
  };

  const confirmSignup = async (data: SignupMutation) => {

    /* TODO: Starting here, these should raise errors */
    if (!data.signup) {
      return;
    }
    if (data.signup.__typename !== 'AuthPayload') {
      return;
    }
    const { token } = data.signup;
    if (!token) {
      return;
    }
    /* TODO: Ending here, these should raise errors */

    saveUserData(token);
    props.history.push('/');
  };

  return (
    <div>
      <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
      <div className="flex flex-column">
        {!login && (
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
          />
        )}
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </div>
      <div className="flex mt3">
        {login ? (
          <LoginComponent
            variables={{ email, password }}
            onCompleted={data => confirmLogin(data)}
          >
            {mutation => (
              <div className="pointer mr2 button" onClick={() => mutation()}>
                login
              </div>
            )}
          </LoginComponent>
        ) : (
          <SignupComponent
            variables={{ email, password, name }}
            onCompleted={data => confirmSignup(data)}
          >
            {mutation => (
              <div className="pointer mr2 button" onClick={() => mutation()}>
                create account
              </div>
            )}
          </SignupComponent>
        )}
        <div
          className="pointer button"
          onClick={() => setLogin(!login)}
        >
          {login
            ? 'need to create an account?'
            : 'already have an account?'
          }
        </div>
      </div>
    </div>
  );
};

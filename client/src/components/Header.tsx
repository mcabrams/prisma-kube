import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';

import { getAuthToken, removeAuthToken } from '@src/helpers/auth';

const HeaderWithoutRouter: React.FC<RouteComponentProps> = props => {
  const authToken = getAuthToken();

  const logout = () => {
    removeAuthToken();
    props.history.push('/');
  };

  return (
    <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <div className="fw7 mr1">Hacker News</div>
        <Link to="/" className="ml1 no-underline black">
          new
        </Link>
        {authToken && (
          <div className="flex">
            <div className="ml1">|</div>
            <Link to="/create" className="ml1 no-underline black">
              submit
            </Link>
          </div>
        )}
        <div className="flex flex-fixed">
          {authToken ? (
            <div
              className="ml1 pointer black"
              onClick={() => logout()}
            >
              logout
            </div>
          ) : (
            <Link to="/login" className="ml1 no-underline black">
              login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export const Header = withRouter(HeaderWithoutRouter);

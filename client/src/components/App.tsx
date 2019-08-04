import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Header } from '@src/components/Header';
import { CreateLink } from '@src/components/CreateLink';
import { LinkList } from '@src/components/LinkList';
import { Login } from '@src/components/Login';

export const App: React.FC = () => (
  <div className="center w85">
    <Header />
    <div className="ph3 pv1 background-gray">
      <Switch>
        <Route exact path="/" component={LinkList} />
        <Route exact path="/create" component={CreateLink} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </div>
  </div>
);

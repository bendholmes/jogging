import React from "react";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title'

import { URLs } from "../constants"
import Initialize from "./Initialize";
import JogsPage from "./Jogs";
import UsersPage from "./Users";
import Login from "./Login";
import Logout from "./Logout";
import Signup from "./Signup";
import NotFound from "./NotFound";
import LoggedInComponent from "./LoggedInComponent";

const App = () => (
  <DocumentTitle title="Jogging">
    <Router>
      <Switch>
        <Route exact path={URLs.INIT} component={Initialize} />
        <Route path={URLs.LOGIN} component={Login} />
        <Route path={URLs.LOGOUT} component={Logout} />
        <Route path={URLs.SIGNUP} component={Signup} />
        <LoggedInComponent path={URLs.JOGS} component={JogsPage} />
        <LoggedInComponent
          path={URLs.USERS}
          component={UsersPage}
          permissions={['admin', 'manager']} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </DocumentTitle>
);

export default App;
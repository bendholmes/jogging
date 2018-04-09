import React from "react";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title'

import { URLs } from "../constants"
import Initialize from "./Initialize";
import Jogs from "./Jogs";
import Login from "./Login";
import Logout from "./Logout";
import NotFound from "./NotFound";
import LoggedInComponent from "./LoggedInComponent";

const App = () => (
  <DocumentTitle title="Jogging">
    <Router>
      <Switch>
        <Route exact path={URLs.INIT} component={Initialize} />
        <LoggedInComponent path={URLs.JOGS} component={Jogs} />
        <Route path={URLs.LOGIN} component={Login} />
        <Route path={URLs.LOGOUT} component={Logout} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </DocumentTitle>
);

export default App;
import React from "react";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title'

import { URLs } from "./constants"
import Initialize from "./components/Initialize";
import JogsPage from "./components/Jogs";
import ReportsPage from "./pages/Report";
import UsersPage from "./components/Users";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Signup from "./components/Signup";
import NotFound from "./components/NotFound";
import LoggedOutComponent from "./components/LoggedOutComponent";
import LoggedInComponent from "./components/LoggedInComponent";

const APP_TITLE = "Jogging";

const App = () => (
  <DocumentTitle title={APP_TITLE}>
    <Router>
      <Switch>
        <Route exact path={URLs.INIT} component={Initialize} />
        <LoggedOutComponent path={URLs.LOGIN} component={Login} />
        <LoggedOutComponent path={URLs.SIGNUP} component={Signup} />
        <LoggedInComponent path={URLs.JOGS} component={JogsPage} />
        <LoggedInComponent path={URLs.REPORTS} component={ReportsPage} />
        <LoggedInComponent path={URLs.USERS} component={UsersPage} />
        <LoggedInComponent path={URLs.LOGOUT} component={Logout} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </DocumentTitle>
);

export default App;
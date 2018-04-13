import React from "react";
import { Route, Redirect } from 'react-router-dom';

import NavBar from "./NavBar";
import LoggedInAs from "./LoggedInAs";
import { getUser } from "../utils";
import { URLs } from "../constants";
import { hasPagePermission } from "../permissions";


/**
 * Wraps pages requiring login, checking they are authenticated. If permissions are provided
 * via props, they are also checked. If no user is set then we redirect to the login page.
 */
const LoggedInComponent = ({component: Component, ...rest}) => {
  const getComponent = (matchProps) => {
    // TODO: Maybe better to reload the object from the server so we're always up to date on e.g. a refresh
    const user = getUser();
    if (!user) {
      return (
        <Redirect to={URLs.LOGIN}/>
      );
    }

    if (!hasPagePermission(matchProps.location.pathname)) {
      return (
        <Redirect to={URLs.HOME}/>
      );
    }

    return (
      <div>
        <NavBar />
        <LoggedInAs />
        <Component {...matchProps} />
      </div>
    );
  };

  return (
    <Route {...rest} render={getComponent} />
  );
};

export default LoggedInComponent;

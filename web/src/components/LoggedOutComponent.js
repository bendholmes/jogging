import React from "react";
import { Route, Redirect } from 'react-router-dom';

import LoggedOutNavBar from "./LoggedOutNavBar";
import { getUser } from "../utils";
import { URLs } from "../constants";

/**
 * Wraps pages only visible when logged out, such as the login and signup pages.
 */
const LoggedOutComponent = ({component: Component, ...rest}) => {
  function getComponent(matchProps) {
    const user = getUser();
    if (user) {
      return (
        <Redirect to={URLs.HOME}/>
      );
    }

    return (
      <div>
        <LoggedOutNavBar />
        <Component {...matchProps} />
      </div>
    );
  }

  return (
    <Route {...rest} render={getComponent} />
  );
};

export default LoggedOutComponent;

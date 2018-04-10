import React from "react";
import { Route, Redirect } from 'react-router-dom';

import NavBar from "./NavBar";
import { getUser } from "../utils";
import {URLs} from "../constants";

/**
 * Gets the given component including other common components such as the NavBar. If no user is set
 * then we redirect to the login page.
 */

const LoggedInComponent = ({component: Component, ...rest}) => {
  function getComponent(matchProps, rest) {
    // TODO: Maybe better to reload the object from the server so we're always up to date on e.g. a refresh
    const user = getUser();
    if (!user) {
      return (
        <Redirect to={URLs.LOGIN}/>
      );
    }

    // Check the permissions required, if applicable
    if (rest.permissions && !rest.permissions.includes(user.role)) {
      return (
        <Redirect to={URLs.HOME}/>
      );
    }

    return (
      <div>
        <NavBar />
        <Component {...matchProps} />
      </div>
    );
  }

  return (
    <Route {...rest} render={(matchProps) => getComponent(matchProps, rest)} />
  );
};

export default LoggedInComponent;

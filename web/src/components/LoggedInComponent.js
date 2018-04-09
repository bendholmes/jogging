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
  function getComponent(matchProps) {
    if (!getUser()) {
      return (
        <Redirect to={URLs.LOGIN}/>
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
    <Route {...rest} render={getComponent} />
  );
};

export default LoggedInComponent;

import React from "react";
import { Link } from "react-router-dom";

import { URLs } from "../constants";


const LoggedOutNavBar = () => (
  <ul>
    <li><Link to={URLs.LOGIN}>Login</Link></li>
    <li><Link to={URLs.SIGNUP}>Signup</Link></li>
  </ul>
);

export default LoggedOutNavBar;

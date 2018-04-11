import React from "react";
import { Link } from "react-router-dom";

import { URLs } from "../constants";
import { hasPagePermission } from "../permissions";

const PAGES = [
  {name: "Jogs", url: URLs.JOGS},
  {name: "Reports", url: URLs.REPORTS},
  {name: "Users", url: URLs.USERS},
  {name: "Logout", url: URLs.LOGOUT},
];

const validPage = (page) => {
  if (hasPagePermission(page.url)) {
    return (
      <li key={page.url}>
        <Link to={page.url}>{page.name}</Link>
      </li>
    )
  }
};

const NavBar = () => (
  <ul>
    {PAGES.map(validPage)}
  </ul>
);

export default NavBar;
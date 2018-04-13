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

/**
 * Determines if the page is viewable by the logged in user and renders it if so.
 * @param page The page to validate.
 * @returns {*} Link component.
 */
const validPage = (page) => {
  if (hasPagePermission(page.url)) {
    return (
      <li key={page.url}>
        <Link to={page.url}>{page.name}</Link>
      </li>
    )
  }
};

/**
 * Renders all pages viewable by the user based on their permissions.
 * @returns {*} Rendered links.
 * @constructor
 */
const NavBar = () => (
  <ul className="nav">
    {PAGES.map(validPage)}
  </ul>
);

export default NavBar;
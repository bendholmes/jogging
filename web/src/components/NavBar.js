import React from "react";
import { Link } from "react-router-dom";


const NavBar = () => (
  <ul>
    <li><Link to="/jogs">Jogs</Link></li>
    <li><Link to="/reports">Reports</Link></li>
    <li><Link to="/users">Users</Link></li>
    <li><Link to="/logout">Logout</Link></li>
  </ul>
);

export default NavBar;
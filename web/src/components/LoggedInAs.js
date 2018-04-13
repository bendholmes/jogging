import React from "react";

import { getUser } from "../utils";


const LoggedInAs = () => {
  let user = getUser();

  return (
    <div className="loggedInAs">
      You are logged in as {user.username} ({user.role}).
    </div>
  )
};

export default LoggedInAs;

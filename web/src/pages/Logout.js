import React from "react";
import { post, logout } from "../utils";

/**
 * Logs out the user and redirects them to login.
 */
export default class Logout extends React.Component {
  componentDidMount() {
    post("logout")
    .then(
      (response) => {
        logout(this.props.history);
      }
    )
  }

  render() {
    return (
      <div>
        Logging out...
      </div>
    );
  }
}

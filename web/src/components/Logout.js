import React from "react";
import { URLs } from "../constants";
import { post, setUser } from "../utils";

/**
 * Logs out the user and redirects them to login.
 */
export default class Logout extends React.Component {
  componentDidMount() {
    post("logout")
    .then(
      (response) => {
        setUser();
        this.props.history.push(URLs.LOGIN);
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

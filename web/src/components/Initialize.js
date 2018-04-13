import React from "react";

import { authenticate } from "../utils";
import {URLs} from "../constants";


/**
 * Homepage component that authenticates the user and redirects to the login or jogs page as applicable.
 */
export default class Initialize extends React.Component {
  state = {
    error: ''
  };

  success = (response) => {
    this.props.history.push(URLs.HOME);
  };

  error = (error) => {
    this.setState({error: "Error initializing: " + error + ". Is the server running? Run the following in a shell: server/manage.py runserver 8080"});
  };

  componentDidMount() {
    authenticate(this, this.success, this.error);
  }

  render() {
    const message = this.state.error || "Initializing...";

    return (
      <div>{message}</div>
    );
  }
}
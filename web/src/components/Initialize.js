import React from "react";

import { get } from "../utils";
import { URLs } from "../constants";


export default class Initialize extends React.Component {
  constructor() {
    super();

    this.state = {
      error: ''
    };
  }

  componentDidMount() {
    // TODO: Move to util function loadUser and pass in success/fail callbacks
    get("user/me")
    .then(
      (response) => {
        if (response.status !== 200) {
          this.props.history.push(URLs.LOGIN);
        } else {
          // TODO: Need to do response.json() and then .then to get the response data
          this.props.history.push(URLs.HOME);
        }
      }
    )
    .catch(
      (error) => {
        this.setState({error: "Error initializing: " + error + ". Is the server running? Run the following in a shell: server/manage.py runserver 8080"});
      }
    );
  }

  render() {
    const message = this.state.error || "Initializing...";

    return (
      <div>{message}</div>
    );
  }
}
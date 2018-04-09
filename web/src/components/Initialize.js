import React from "react";

import { get } from "../utils";
import { URLs } from "../constants";

export default class Initialize extends React.Component {
  componentDidMount() {
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
    );
  }

  render() {
    return (
      <div>
        Initializing...
      </div>
    );
  }
}
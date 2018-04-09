import React from "react";

import { get } from "../utils";

export const Jog = (props) => (
  <p>
    {props.jog.distance} / {props.jog.time} / {props.jog.average_speed}
  </p>
);

export default class Jogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jogs: [],
    }
  }

  componentDidMount() {
    get("jog")
    .then(
      (response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      }
    )
    .then(
      (data) => {
        this.setState({jogs: data});
      }
    );
  }

  renderJog(jog) {
    return <Jog key={jog.id} jog={jog} />
  }

  render() {
    return (
      <div>
        {this.state.jogs.map(jog => this.renderJog(jog))}
      </div>
    );
  }
}
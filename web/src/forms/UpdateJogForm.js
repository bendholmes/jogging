import React from "react";

import {isAdmin, patch} from "../utils";
import Form from "../forms/Form";

export default class UpdateJogForm extends React.Component {
  ENDPOINT = "jog";
  UPDATE_FAILED_MESSAGE = "Failed to update jog: ";
  FORM_HEADING = "Update Jog Form";
  FORM_ACTION_NAME = "Update Jog";

  state = {
    message: '',
    key: 0
  };

  inputs = [
    {label: "Date", name: "date", type: "datetime-local"},
    {label: "Distance", name: "distance", type: "number"},
    {label: "Time", name: "time", type: "time"},
  ];

  constructor() {
    super();

    // Add an owner field if the logged in user is an admin
    if (isAdmin()) this.inputs.push({label: "Owner", name: "owner", type: "text"});
  }

  onSubmit = (e, values) => {
    e.preventDefault();

    patch(this.ENDPOINT, this.props.jog.id, values)
    .then(
      (response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      }
    )
    .then(
      (data) => {
        this.props.onUpdate(data); // Update the existing jog in the list
      }
    )
    .catch(
      (error) => {
        this.setState({message: this.UPDATE_FAILED_MESSAGE + error.message});
      }
    )
  };

  render() {
    return (
      <div>
        <Form
          heading={this.FORM_HEADING}
          actionName={this.FORM_ACTION_NAME}
          message={this.state.message}
          inputs={this.inputs}
          onSubmit={this.onSubmit}
          data={this.props.jog}
        />
        <input type="submit" value="Cancel" onClick={this.props.onCancel}/>
      </div>
    );
  }
}
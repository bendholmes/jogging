import React from "react";

import Form from "./Form"
import { post } from "../utils";


export default class CreateJogForm extends React.Component {
  JOG_CREATED_MESSAGE = "Jog created! :)";
  CREATE_FAILED_MESSAGE = "Failed to create jog: ";
  FORM_HEADING = "Create Jog Form";
  FORM_ACTION_NAME = "Create Jog";
  ENDPOINT = "jog";

  constructor() {
    super();

    this.state = {
      message: '',
      key: 0
    };
  }

  createJog = (e, values) => {
    e.preventDefault();

    post(this.ENDPOINT, values)
    .then(
      (response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      }
    )
    .then(
      (data) => {
        this.success(data);
      }
    )
    .catch(
      (error) => {
        this.error(error.message);
      }
    )
  };

  success = (data) => {
    this.setState({message: this.JOG_CREATED_MESSAGE});
    this.setState({key: this.state.key + 1}); // Clear the form
    this.props.addJog(data); // Add the new jog to the list
  };

  error = (message) => {
    this.setState({message: this.CREATE_FAILED_MESSAGE + message});
  };

  inputs = [
    {label: "Date", name: "date", type: "datetime-local"},
    {label: "Distance", name: "distance", type: "number"},
    {label: "Time", name: "time", type: "time"},
  ];

  render() {
    return (
      <Form
        key={this.state.key}
        heading={this.FORM_HEADING}
        actionName={this.FORM_ACTION_NAME}
        message={this.state.message}
        inputs={this.inputs}
        onSubmit={this.createJog}
      />
    );
  }
}

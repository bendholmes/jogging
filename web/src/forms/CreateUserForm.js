import React from "react";

import Form from "./Form"
import { post } from "../utils";


export default class CreateUserForm extends React.Component {
  ENDPOINT = "user";

  createUser = (e, values) => {
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
        this.props.success(data);
      }
    )
    .catch(
      (error) => {
        this.props.error(error.message);
      }
    )
  };

  inputs = [
    {label: "Username", name: "username", type: "input"},
    {label: "Password", name: "password", type: "password"},
    {label: "Admin?", name: "is_superuser", type: "checkbox"},
    {label: "Manager?", name: "is_staff", type: "checkbox"}
  ];

  render() {
    return (
      <Form
        heading={this.props.heading}
        actionName={this.props.actionName}
        message={this.props.message}
        inputs={this.inputs}
        onSubmit={this.createUser}
      />
    );
  }
}

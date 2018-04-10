import React from "react";

import Form from "./Form"
import { post } from "../utils";


export default class CreateUserForm extends React.Component {
  createUser = (e, values) => {
    e.preventDefault();

    post("user", values)
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
      (statusText) => {
        this.props.error(statusText);
      }
    )
  };

  render() {
    const inputs = [
      {label: "Username", name: "username", type: "input"},
      {label: "Password", name: "password", type: "password"},
      {label: "Admin?", name: "is_superuser", type: "checkbox"},
      {label: "Manager?", name: "is_staff", type: "checkbox"}
    ];

    return (
      <Form
        heading={this.props.heading}
        actionName={this.props.actionName}
        message={this.props.message}
        inputs={inputs}
        onSubmit={this.createUser}
      />
    );
  }
}

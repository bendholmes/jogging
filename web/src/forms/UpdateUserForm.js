import React from "react";

import { patch } from "../utils";
import Form from "../forms/Form";


/**
 * Form used to update users on the admin users page.
 */
export default class UpdateUserForm extends React.Component {
  ENDPOINT = "user";
  UPDATE_FAILED_MESSAGE = "Failed to update user: ";
  FORM_HEADING = "Update User Form";
  FORM_ACTION_NAME = "Update User";

  state = {
    message: '',
    key: 0
  };

  updateUser = (e, values) => {
    e.preventDefault();

    patch(this.ENDPOINT, this.props.user.id, values)
    .then(
      (response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      }
    )
    .then(
      (data) => {
        this.props.onUpdate(data); // Update the existing user in the list
      }
    )
    .catch(
      (error) => {
        this.setState({message: this.UPDATE_FAILED_MESSAGE + error.message});
      }
    )
  };

  inputs = [
    {label: "Username", name: "username", type: "input"},
    {label: "Password", name: "password", type: "password"},
    {label: "Admin?", name: "is_superuser", type: "checkbox"},
    {label: "Manager?", name: "is_staff", type: "checkbox"},
  ];

  render() {
    return (
      <div>
        <Form
          heading={this.FORM_HEADING}
          actionName={this.FORM_ACTION_NAME}
          message={this.state.message}
          inputs={this.inputs}
          onSubmit={this.updateUser}
          data={this.props.user}
        />
        <input type="submit" value="Cancel" onClick={this.props.onCancel}/>
      </div>
    );
  }
}
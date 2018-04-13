import React from "react";

import CreateUserForm from "../forms/CreateUserForm";


/**
 * Form used to create a user on the admin users page.
 */
export default class AdminCreateUserForm extends React.Component {
  USER_CREATED_MESSAGE = "User created! :)";
  CREATE_FAILED_MESSAGE = "Failed to create user: ";
  FORM_HEADING = "Create User Form";
  FORM_ACTION_NAME = "Create User";

  state = {
    message: '',
    key: 0
  };

  success = (data) => {
    this.setState({message: this.USER_CREATED_MESSAGE});
    this.setState(prevState => ({key: prevState.key + 1})); // Clear the form
    this.props.addUser(data); // Add the new user to the list
  };

  error = (message) => {
    this.setState({message: this.CREATE_FAILED_MESSAGE + message});
  };

  render() {
    return (
      <CreateUserForm
        key={this.state.key}
        heading={this.FORM_HEADING}
        actionName={this.FORM_ACTION_NAME}
        message={this.state.message}
        success={this.success}
        error={this.error}
      />
    );
  }
}
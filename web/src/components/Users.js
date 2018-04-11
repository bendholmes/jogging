import React from "react";

import DocumentTitle from 'react-document-title'

import CreateUserForm from "../forms/CreateUserForm";


export default class UsersPage extends React.Component {
  PAGE_TITLE = "All Users";
  USER_CREATED_MESSAGE = "User created! :)";
  CREATE_FAILED_MESSAGE = "Failed to create user: ";
  FORM_HEADING = "Create User Form";
  FORM_ACTION_NAME = "Create User";

  constructor() {
    super();

    this.state = {
      message: ''
    };
  }

  success = (data) => {
    this.setState({message: this.USER_CREATED_MESSAGE});
  };

  error = (message) => {
    this.setState({message: this.CREATE_FAILED_MESSAGE + message});
  };

  render() {
    return (
      <DocumentTitle title={this.PAGE_TITLE}>
        <CreateUserForm
          heading={this.FORM_HEADING}
          actionName={this.FORM_ACTION_NAME}
          message={this.state.message}
          success={this.success}
          error={this.error}
        />
      </DocumentTitle>
    );
  }
}

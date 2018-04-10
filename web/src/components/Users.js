import React from "react";

import DocumentTitle from 'react-document-title'

import { get, getUser, isAdmin } from "../utils";
import CreateUserForm from "./CreateUserForm";
import { URLs } from "../constants";


export default class UsersPage extends React.Component {
  constructor() {
    super();

    this.state = {
      message: ''
    };
  }

  success = (data) => {
    this.setState({message: "User created! :)"});
  };

  error = (statusText) => {
    this.setState({message:"Failed to create user: " + statusText});
  };

  render() {
    return (
      <DocumentTitle title="All Users">
        <CreateUserForm
          heading="Create User Form"
          actionName="Create User"
          message={this.state.message}
          success={this.success}
          error={this.error}
        />
      </DocumentTitle>
    );
  }
}

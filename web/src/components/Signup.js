import React from "react";

import DocumentTitle from 'react-document-title'

import CreateUserForm from "../forms/CreateUserForm"
import { URLs } from "../constants";


export default class Signup extends React.Component {
  constructor() {
    super();

    this.state = {
      message: ''
    };
  }

  success = (data) => {
    this.props.history.push(URLs.LOGIN);
  };

  error = (statusText) => {
    this.setState({message: "Failed to sign up: " + statusText});
  };

  render() {
    return (
      <DocumentTitle title="Signup">
        <CreateUserForm
          heading="Signup Form"
          actionName="Signup"
          message={this.state.message}
          success={this.success}
          error={this.error}
        />
      </DocumentTitle>
    );
  }
}

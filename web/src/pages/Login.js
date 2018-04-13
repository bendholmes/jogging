import React from "react";

import DocumentTitle from 'react-document-title'

import Form from "../forms/Form"
import { URLs } from "../constants";
import { post, setUser } from "../utils";


/**
 * Login page. Provides a login form and redirects to the jogs page on success.
 */
export default class Login extends React.Component {
  PAGE_TITLE = "Login to Jogging";
  FORM_HEADING = "Login Form";
  FORM_ACTION_NAME = "Login";
  ENDPOINT = "login";
  ERROR_MESSAGE = "Login failed: ";

  state = {
    message: ''
  };

  login(e, values) {
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
        setUser(data);
        this.props.history.push(URLs.HOME);
      }
    )
    .catch(
      (statusText) => {
        this.setState({message: this.ERROR_MESSAGE + statusText});
      }
    )
  }

  inputs = [
    {label: "Username", name: "username", type: "input"},
    {label: "Password", name: "password", type: "password"},
  ];

  render() {
    return (
      <DocumentTitle title={this.PAGE_TITLE}>
        <Form
          heading={this.FORM_HEADING}
          actionName={this.FORM_ACTION_NAME}
          message={this.state.message}
          inputs={this.inputs}
          onSubmit={(e, values) => {this.login(e, values)}}
        />
      </DocumentTitle>
    );
  }
}

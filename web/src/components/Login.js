import React from "react";

import DocumentTitle from 'react-document-title'

import Form from "./Form"
import { URLs } from "../constants";
import { post, setUser } from "../utils";


export default class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      message: ''
    };
  }

  login(e, values) {
    e.preventDefault();

    post("login", values)
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
        this.setState({message: "Login failed: " + statusText});
      }
    )
  }

  render() {
    const inputs = [
      {label: "Username", name: "username", type: "input"},
      {label: "Password", name: "password", type: "password"},
    ];

    return (
      <DocumentTitle title="Login to Jogging">
        <Form
          heading="Login Form"
          actionName="Login"
          message={this.state.message}
          inputs={inputs}
          onSubmit={(e, values) => {this.login(e, values)}}
        />
      </DocumentTitle>
    );
  }
}

import React from "react";
import { URLs } from "../constants";
import { post, setUser } from "../utils";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      error: '',
    };
  }

  login() {
    post(
      "login",
      {username: this.state.username, password: this.state.password}
    )
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
        this.setState({'error': 'Login failed: ' + statusText});
      }
    )
  }

  renderError() {
    if (this.state.error) {
      return (
        <p className="error">{this.state.error}</p>
      );
    }
  }

  update(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    return (
      <div>
        {this.renderError()}
        <input name="username" value={this.state.username} onChange={(e) => {this.update(e)}} />
        <input name="password" type="password" value={this.state.password} onChange={(e) => {this.update(e)}} />
        <div id="loginButton" onClick={() => {this.login()}}>Login</div>
      </div>
    );
  }
}

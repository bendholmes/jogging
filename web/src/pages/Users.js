import React from "react";

import DocumentTitle from "react-document-title";

import Form from "../forms/Form";
import CreateUserForm from "../forms/CreateUserForm";
import {get, del, without, patch, replace } from "../utils";


class User extends React.Component {
  onUpdate = () => {
    this.props.onUpdate(this.props.user);
  };

  onDelete = () => {
    this.props.onDelete(this.props.user);
  };

  render() {
    const user = this.props.user;

    return (
      <tr>
        <td>{user.username}</td>
        <td>{user.is_superuser ? "Yes" : "No"}</td>
        <td>{user.is_staff ? "Yes" : "No"}</td>
        <td>
          <span onClick={this.onUpdate}>Update</span>
          <span onClick={this.onDelete}>Del</span>
        </td>
      </tr>
    );
  }
}

class CreateForm extends React.Component {
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

class UpdateUserForm extends React.Component {
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

class Users extends React.Component {
  ENDPOINT = "user";
  NO_RESULTS_MESSAGE = "No users... huh?";
  INITIAL_MESSAGE = "Loading users...";

  state = {
    users: [],
    updateUser: null,
    message: this.INITIAL_MESSAGE,
  };

  componentDidMount() {
    get(this.ENDPOINT)
    .then(
      (response) => {
        if (!response.ok) throw Error(response.statusText);
        this.setState({message: ''});
        return response.json();
      }
    )
    .then(
      (data) => {
        this.setState({users: data});
        if (!data.length) throw Error(this.NO_RESULTS_MESSAGE);
      }
    )
    .catch(
      (error) => {
        this.setState({message: error.message});
      }
    );
  }

  addUser = (user) => {
    this.setState((prevState) => {
      let users = prevState.users;
      users.unshift(user);
      return {users: users};
    });
  };

  showUpdateUserForm = (user) => {
    this.setState({updateUser: user});
  };

  hideUpdateUserForm = () => {
    this.showUpdateUserForm(null);
  };

  updateUser = (user) => {
    this.setState((prevState) => ({
      users: replace(prevState.users, user.id, user)
    }));
    this.hideUpdateUserForm();
  };

  /**
   * Removes the given user from the list and server.
   * @param user The user to remove.
   */
  deleteUser = (user) => {
    this.setState(prevState => ({users: without(prevState.users, user)}));

    del(this.ENDPOINT, user.id)
    .then(
      (response) => {
        if (!response.ok) throw Error(response.statusText);
      }
    );
  };

  renderUser = (user) => (
    <User
      key={user.id}
      user={user}
      onDelete={this.deleteUser}
      onUpdate={this.showUpdateUserForm}
    />
  );

  renderUpdateForm = () => (
    <UpdateUserForm
      key={this.state.updateUser.id}
      user={this.state.updateUser}
      onUpdate={this.updateUser}
      onCancel={this.hideUpdateUserForm}
    />
  );

  usersTable = () => (
    <table>
      <thead>
        <tr>
          <td>Username</td>
          <td>Is Admin</td>
          <td>Is Manager</td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        {this.state.users.map(user => this.renderUser(user))}
      </tbody>
    </table>
  );

  message = () => (
    <div>{this.state.message}</div>
  );

  render() {
    const users = this.state.message ? this.message() : this.usersTable();
    const updateForm = this.state.updateUser ? this.renderUpdateForm() : null;

    return (
      <div>
        <CreateForm addUser={this.addUser} />
        {updateForm}
        <h2>All Users</h2>
        {users}
      </div>
    );
  }
}

export default class UsersPage extends React.Component {
  PAGE_TITLE = "All Users";

  render() {
    return (
      <DocumentTitle title={this.PAGE_TITLE}>
        <Users />
      </DocumentTitle>
    );
  }
};

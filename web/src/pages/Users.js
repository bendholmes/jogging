import React from "react";

import DocumentTitle from "react-document-title";

import UpdateUserForm from "../forms/UpdateUserForm";
import AdminCreateUserForm from "../forms/AdminCreateUserForm";
import { get, del, without, replace, authenticate, isUser, getUser, logout } from "../utils";


/**
 * Renders a user row with update and delete actions.
 */
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

/**
 * Renders a table of users, retrieving them from the REST API. Provides functions to manage CRUD operations
 * via additional forms.
 */
class Users extends React.Component {
  ENDPOINT = "user";
  NO_RESULTS_MESSAGE = "No users... huh?";
  INITIAL_MESSAGE = "Loading users...";

  state = {
    users: [],
    updateUser: null,
    message: this.INITIAL_MESSAGE,
  };

  /**
   * Fetches the list of users once the component is mounted.
   */
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

  /**
   * Adds the given user to the top of the list.
   * @param user The user to add.
   */
  addUser = (user) => {
    this.setState((prevState) => {
      let users = prevState.users;
      users.unshift(user);
      return {users: users};
    });
  };

  /**
   * Updates the given user in the list.
   * @param user The updated user.
   */
  updateUser = (user) => {
    this.setState((prevState) => ({
      users: replace(prevState.users, user.id, user)
    }));
    this.hideUpdateUserForm();

    // Force a logout if they updated their own user to ensure re-authentication
    if (user.id === getUser().id) logout(this.props.history);
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
        authenticate(this); // Re-authenticate as they may have deleted their own user
      }
    );
  };

  showUpdateUserForm = (user) => {
    this.setState({updateUser: user});
  };

  hideUpdateUserForm = () => {
    this.showUpdateUserForm(null);
  };

  renderUpdateForm = () => (
    <UpdateUserForm
      key={this.state.updateUser.id}
      user={this.state.updateUser}
      onUpdate={this.updateUser}
      onCancel={this.hideUpdateUserForm}
    />
  );

  renderUser = (user) => (
    <User
      key={user.id}
      user={user}
      onDelete={this.deleteUser}
      onUpdate={this.showUpdateUserForm}
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
        {!isUser() && <AdminCreateUserForm addUser={this.addUser} />}
        {updateForm}
        <h2>All Users</h2>
        {users}
      </div>
    );
  }
}

/**
 * Admin users page. Lists users and provides CRUD.
 */
export default class UsersPage extends React.Component {
  PAGE_TITLE = "All Users";

  render() {
    return (
      <DocumentTitle title={this.PAGE_TITLE}>
        <Users history={this.props.history} />
      </DocumentTitle>
    );
  }
};

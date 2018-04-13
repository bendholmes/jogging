import React from "react";

import DocumentTitle from "react-document-title";
import moment from "moment";

import CreateJogForm from "../forms/CreateJogForm";
import UpdateJogForm from "../forms/UpdateJogForm";
import FilterJogsForm from "../forms/FilterJogsForm";
import {get, isAdmin, formatDate, del, without, replace} from "../utils";


/**
 * Renders a jog row with update and delete actions.
 */
class Jog extends React.Component {
  onUpdate = () => {
    this.props.onUpdate(this.props.jog);
  };

  onDelete = () => {
    this.props.onDelete(this.props.jog);
  };

  render() {
    const jog = this.props.jog;

    return (
      <tr>
        <td>{formatDate(jog.date)}</td>
        <td>{jog.distance}</td>
        <td>{jog.time}</td>
        <td>{jog.average_speed}</td>
        {isAdmin() && <td>{jog.owner}</td>}
        <td>
          <span onClick={this.onUpdate}>Update</span>
          <span onClick={this.onDelete}>Del</span>
        </td>
      </tr>
    );
  }
}

/**
 * Renders a table of jogs, retrieving them from the REST API. Provides functions to manage CRUD operations
 * via additional forms. Supports filtering by a date range.
 */
class Jogs extends React.Component {
  ENDPOINT = "jog";
  INITIAL_MESSAGE = "Loading jogs...";
  NO_RESULTS_MESSAGE = "No jogs :(";

  state = {
    jogs: [],
    updateJog: null,
    message: this.INITIAL_MESSAGE
  };

  componentDidMount() {
    this.loadJogs();
  }

  /**
   * Retrieves the jogs from the server. The server will filter this based on permissions, ensuring only the jogs
   * you have access to are listed.
   * @param filters Any filters to apply to the listing.
   */
  loadJogs = (filters) => {
    get(this.ENDPOINT, filters)
    .then(
      (response) => {
        if (!response.ok) throw Error(response.statusText);
        this.setState({message: ''});
        return response.json();
      }
    )
    .then(
      (data) => {
        this.setState({jogs: data});
        if (!data.length) throw Error(this.NO_RESULTS_MESSAGE);
      }
    )
    .catch(
      (error) => {
        this.setState({message: error.message});
      }
    );
  };

  _sortJogs(jogs) {
    jogs.sort((j1, j2) => moment(j1.date).unix()  < moment(j2.date).unix() ? 1 : -1);
  }

  /**
   * Adds a new jog to the list and re-sorts them by date.
   * @param jog The jog to add.
   */
  addJog = (jog) => {
    this.setState((prevState) => {
      let jogs = prevState.jogs;
      jogs.push(jog);
      this._sortJogs(jogs);
      return {jogs: jogs};
    });
  };

  /**
   * Updates a jog in the list with the given jog, re-sorts them by date and then hides the update form.
   * @param jog Jog to update.
   */
  updateJog = (jog) => {
    this.setState((prevState) => {
      let jogs = replace(prevState.jogs, jog.id, jog);
      this._sortJogs(jogs);
      return {jogs: jogs};
    });
    this.hideUpdateJogForm();
  };

  /**
   * Deletes a jog and removes it from the list.
   * @param jog The jog to delete.
   */
  deleteJog = (jog) => {
    this.setState(prevState => ({jogs: without(prevState.jogs, jog)}));

    del(this.ENDPOINT, jog.id)
    .then(
      (response) => {
        if (!response.ok) throw Error(response.statusText);
      }
    );
  };

  /**
   * Re-loads the jogs applying the given filters.
   * @param e The event object.
   * @param filters The filters to apply.
   */
  filterJogs = (e, filters) => {
    e.preventDefault();
    this.loadJogs(filters);
  };

  renderFilterForm = () => (
    <div>
      <FilterJogsForm onSubmit={this.filterJogs} loadJogs={this.loadJogs} />
    </div>
  );

  showUpdateJogForm = (jog) => {
    this.setState({updateJog: jog});
  };

  hideUpdateJogForm = () => {
    this.showUpdateJogForm(null);
  };

  renderCreateForm = () => (
    <div>
      <CreateJogForm addJog={this.addJog} />
    </div>
  );

  renderUpdateForm = () => (
    <UpdateJogForm
      key={this.state.updateJog.id}
      jog={this.state.updateJog}
      onUpdate={this.updateJog}
      onCancel={this.hideUpdateJogForm}
    />
  );

  renderJog = (jog) => (
    <Jog
      key={jog.id}
      jog={jog}
      onDelete={this.deleteJog}
      onUpdate={this.showUpdateJogForm}
    />
  );

  jogs = () => (
    <div>
      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Distance</td>
            <td>Time</td>
            <td>Average Speed (mph)</td>
            {isAdmin() && <td>Owner</td>}
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {this.state.jogs.map(jog => this.renderJog(jog))}
        </tbody>
      </table>
    </div>
  );

  noJogs = () => (
    <div>{this.state.message}</div>
  );

  render() {
    const jogs = this.state.jogs.length ? this.jogs() : this.noJogs();
    const updateForm = this.state.updateJog ? this.renderUpdateForm() : null;

    return (
      <div>
        <h2>My Jogs</h2>
        {this.renderCreateForm()}
        {updateForm}
        {this.renderFilterForm()}
        {jogs}
      </div>
    );
  }
}

/**
 * Jobs page. Lists jobs and provides CRUD. Admins can see all jobs, regular users and user managers can only
 * see their own jogs.
 */
export default class JogPage extends React.Component {
  render() {
    return (
      <DocumentTitle title="My Jogs">
        <Jogs />
      </DocumentTitle>
    );
  }
}
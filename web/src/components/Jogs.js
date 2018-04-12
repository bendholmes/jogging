import React from "react";

import DocumentTitle from "react-document-title";
import moment from "moment";

import CreateJogForm from "../forms/CreateJogForm";
import FilterJogsForm from "../forms/FilterJogsForm";
import { get, getUser, isAdmin, formatDate, del, without } from "../utils";

class Jog extends React.Component {
  render() {
    const jog = this.props.jog;
    const deleteButton = isAdmin() || getUser().username === jog.owner ?
      <td onClick={this.props.onDelete}>Del</td> : null;

    return (
      <tr>
        <td>{formatDate(jog.date)}</td>
        <td>{jog.distance}</td>
        <td>{jog.time}</td>
        <td>{jog.average_speed}</td>
        {isAdmin() && <td>{jog.owner}</td>}
        {deleteButton}
      </tr>
    );
  }
}

class Jogs extends React.Component {
  ENDPOINT = "jog";

  state = {
    jogs: [],
  };

  onDelete(jog) {
    this.setState(prevState => ({jogs: without(prevState.jogs, jog)}));

    del(this.ENDPOINT, jog.id)
    .then(
      (response) => {
        if (!response.ok) throw Error(response.statusText);
      }
    );
  }

  loadJogs = (filters) => {
    get(this.ENDPOINT, filters)
    .then(
      (response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      }
    )
    .then(
      (data) => {
        this.setState({jogs: data});
      }
    );
  };

  filterJogs = (e, filters) => {
    e.preventDefault();
    this.loadJogs(filters);
  };

  /**
   * Adds a new jog to the list and re-sorts them by date.
   * @param jog The jog to add.
   */
  addJog = (jog) => {
    let jogs = this.state.jogs;
    jogs.push(jog);
    jogs.sort((j1, j2) => moment(j1.date).unix()  < moment(j2.date).unix() ? 1 : -1);
    this.setState({jogs: jogs});
  };

  componentDidMount() {
    this.loadJogs();
  }

  renderJog = (jog) => (
    <Jog key={jog.id} jog={jog} onDelete={() => {this.onDelete(jog)}} />
  );

  renderFilterForm = () => (
    <div>
      <FilterJogsForm onSubmit={this.filterJogs} loadJogs={this.loadJogs} />
    </div>
  );

  renderCreateForm = () => (
    <div>
      <CreateJogForm addJog={this.addJog} />
    </div>
  );

  jogs = () => (
    <div>
      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Distance</td>
            <td>Time</td>
            <td>Average Speed</td>
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
    <div>No jogs :(</div>
  );

  render() {
    const jogs = this.state.jogs.length ? this.jogs() : this.noJogs();
    return (
      <div>
        <h2>My Jogs</h2>
        {this.renderCreateForm()}
        {this.renderFilterForm()}
        {jogs}
      </div>
    );
  }
}

export default class JogPage extends React.Component {
  render() {
    return (
      <DocumentTitle title="My Jogs">
        <Jogs />
      </DocumentTitle>
    );
  }
}
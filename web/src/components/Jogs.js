import React from "react";

import DocumentTitle from 'react-document-title'

import CreateJogForm from "../forms/CreateJogForm";
import FilterJogsForm from "../forms/FilterJogsForm";
import { get, getUser, isAdmin, formatDate } from "../utils";

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
  constructor(props) {
    super(props);
    this.state = {
      jogs: [],
    }
  }

  onDelete(jog) {
    this.setState({jogs: this.state.jogs.filter((oldJog) => oldJog !== jog)});

    // TODO: Call server
  }

  loadJogs = (filters) => {
    get("jog", filters)
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

  addJog = (jog) => {
    let jogs = this.state.jogs;
    jogs.push(jog);
    // TODO: Re-sort by date or insert sorted
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
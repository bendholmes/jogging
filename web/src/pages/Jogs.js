import React from "react";

import DocumentTitle from "react-document-title";
import moment from "moment";

import CreateJogForm from "../forms/CreateJogForm";
import UpdateJogForm from "../forms/UpdateJogForm";
import FilterJogsForm from "../forms/FilterJogsForm";
import {get, isAdmin, formatDate, del, without, replace} from "../utils";

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

class Jogs extends React.Component {
  ENDPOINT = "jog";
  INITIAL_MESSAGE = "Loading jogs...";

  state = {
    jogs: [],
    updateJog: null,
    message: this.INITIAL_MESSAGE
  };

  componentDidMount() {
    this.loadJogs();
  }

  deleteJog(jog) {
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
        if (!response.ok) throw Error(response.statusText);
        this.setState({message: ''});
        return response.json();
      }
    )
    .then(
      (data) => {
        if (!data.length) throw Error(this.NO_RESULTS_MESSAGE);
        this.setState({jogs: data});
      }
    )
    .catch(
      (error) => {
        this.setState({message: error.message});
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

  showUpdateJogForm = (jog) => {
    this.setState({updateJog: jog});
  };

  hideUpdateJogForm = () => {
    this.showUpdateJogForm(null);
  };

  updateJog = (jog) => {
    this.setState((prevState) => ({
      jogs: replace(prevState.jogs, jog.id, jog)
    }));
    this.hideUpdateJogForm();
  };

  renderJog = (jog) => (
    <Jog
      key={jog.id}
      jog={jog}
      onDelete={this.deleteJog}
      onUpdate={this.showUpdateJogForm}
    />
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

  renderUpdateForm = () => (
    <UpdateJogForm
      key={this.state.updateJog.id}
      jog={this.state.updateJog}
      onUpdate={this.updateJog}
      onCancel={this.hideUpdateJogForm}
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
    <div>No jogs :(</div>
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

export default class JogPage extends React.Component {
  render() {
    return (
      <DocumentTitle title="My Jogs">
        <Jogs />
      </DocumentTitle>
    );
  }
}
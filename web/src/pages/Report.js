import React from "react";

import DocumentTitle from 'react-document-title'

import { get } from "../utils";

class Report extends React.Component {
  render() {
    const report = this.props.report;

    return (
      <tr>
        <td>{report.week}</td>
        <td>{report.average_speed}</td>
        <td>{report.distance}</td>
      </tr>
    );
  }
}

class Reports extends React.Component {
  ENDPOINT = "report";
  NO_RESULTS_MESSAGE = "No jogging reports :(";

  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      error: ''
    }
  }

  componentDidMount() {
    get(this.ENDPOINT)
    .then(
      (response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      }
    )
    .then(
      (data) => {
        if (!data.length) throw Error(this.NO_RESULTS_MESSAGE);
        this.setState({reports: data});
      }
    )
    .catch(
      (statusText) => {
        this.setState({error: statusText});
      }
    );
  }

  renderReport = (report) => (
    <Report key={report.week} report={report} />
  );

  reportsTable = () => (
    <table>
      <thead>
        <tr>
          <td>Week</td>
          <td>Average Speed</td>
          <td>Distance</td>
        </tr>
      </thead>
      <tbody>
        {this.state.reports.map(jog => this.renderReport(jog))}
      </tbody>
    </table>
  );

  error = (message) => (
    <div>{message}</div>
  );

  render() {
    const reports = this.state.error ? this.error() : this.reportsTable();
    return (
      <div>
        <h2>My Weekly Jogging Reports</h2>
        {reports}
      </div>
    );
  }
}

export default class ReportsPage extends React.Component {
  PAGE_TITLE = "My Weekly Jogging Reports";

  render() {
    return (
      <DocumentTitle title={this.PAGE_TITLE}>
        <Reports />
      </DocumentTitle>
    );
  }
}
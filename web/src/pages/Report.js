import React from "react";

import DocumentTitle from 'react-document-title'

import { get, formatDate } from "../utils";

/**
 * Renders a report for a given week.
 */
class Report extends React.Component {
  render() {
    const report = this.props.report;

    return (
      <tr>
        <td>{formatDate(report.week)}</td>
        <td>{report.total_jogs}</td>
        <td>{report.average_speed}</td>
        <td>{report.average_distance}</td>
      </tr>
    );
  }
}

/**
 * Renders a table of weekly reports.
 */
class Reports extends React.Component {
  ENDPOINT = "report";
  NO_RESULTS_MESSAGE = "No jogging reports :(";
  INITIAL_MESSAGE = "Loading reports...";

  state = {
    reports: [],
    message: this.INITIAL_MESSAGE
  };

  /**
   * Fetches the list of reports.
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
        if (!data.length) throw Error(this.NO_RESULTS_MESSAGE);
        this.setState({reports: data});
      }
    )
    .catch(
      (error) => {
        this.setState({message: error.message});
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
          <td>Total Jogs</td>
          <td>Average Speed (mph)</td>
          <td>Average Distance</td>
        </tr>
      </thead>
      <tbody>
        {this.state.reports.map(jog => this.renderReport(jog))}
      </tbody>
    </table>
  );

  message = () => (
    <div>{this.state.message}</div>
  );

  render() {
    const reports = this.state.message ? this.message() : this.reportsTable();
    return (
      <div>
        <h2>My Weekly Jogging Reports</h2>
        {reports}
      </div>
    );
  }
}

/**
 * Weekly reports page.
 */
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
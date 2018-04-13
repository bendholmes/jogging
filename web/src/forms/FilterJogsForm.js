import React from "react";

import Form from "./Form";


/**
 * Form providing filters to filter the jogs list by a date range.
 */
export default class FilterJogsForm extends React.Component {
  FORM_HEADING = "Filter Jogs by Date";
  FORM_ACTION_NAME = "Filter";
  FORM_MESSAGE = "Choose the range of dates you wish to show jogs between.";

  state = {
    key: 0,
  };

  inputs = [
    {label: "From", name: "date_0", type: "date"},
    {label: "To", name: "date_1", type: "date"},
  ];

  clearFilterForm = () => {
    this.setState(prevState => ({key: prevState.key + 1})); // Clear the form
    this.props.loadJogs(); // Reload the list with the filters unapplied.
  };

  render() {
    return (
      <div>
        <Form
          key={this.state.key}
          heading={this.FORM_HEADING}
          actionName={this.FORM_ACTION_NAME}
          message={this.FORM_MESSAGE}
          inputs={this.inputs}
          onSubmit={this.props.onSubmit}
        />
        <input type="submit" value="Clear" onClick={this.clearFilterForm}/>
      </div>
    )
  }
}

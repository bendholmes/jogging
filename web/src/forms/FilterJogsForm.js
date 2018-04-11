import React from "react";

import Form from "./Form";


export default class FilterJogsForm extends React.Component {
  FORM_HEADING = "Filter Jogs by Date";
  FORM_ACTION_NAME = "Filter";
  FORM_MESSAGE = "Choose the range of dates you wish to show jogs between.";

  inputs = [
    {label: "From", name: "date_0", type: "date"},
    {label: "To", name: "date_1", type: "date"},
  ];

  constructor(props) {
    super(props);
    this.state = {
      key: 0,
    }
  }

  clearFilterForm = () => {
    this.setState({key: this.state.key + 1});
    this.props.loadJogs();
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

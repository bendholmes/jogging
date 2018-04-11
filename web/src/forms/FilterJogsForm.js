import React from "react";

import Form from "./Form";


const inputs = [
  {label: "From", name: "date_0", type: "date"},
  {label: "To", name: "date_1", type: "date"},
];

const FilterJogsForm = (props) => (
  <Form
    heading={props.heading}
    actionName={props.actionName}
    message={props.message}
    inputs={inputs}
    onSubmit={props.onSubmit}
  />
);

export default FilterJogsForm;

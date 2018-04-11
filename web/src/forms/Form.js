import React from "react";


/**
 * Helper component for constructing controlled forms. Accepts a list of desired inputs and ensures they
 * are hooked up correctly, along with all desired callbacks.
 */
export default class Form extends React.Component {
  initialState = {};

  constructor(props) {
    super(props);

    // Initialize the value state for each input
    for (let input of props.inputs) this.initialState[input.name] = input.type === 'checkbox' ? false : '';
    this.state = this.initialState;
  }

  /**
   * Updates the value for the changed input in the state.
   * @param e Event object.
   */
  update(e) {
    this.setState({[e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value});
  }

  /**
   * Renders a message box.
   * @returns {*} Message box element.
   */
  renderMessage() {
    if (this.props.message) {
      return (
        <div className="message">{this.props.message}</div>
      );
    }
  }

  /**
   * Renders a form input.
   * @param input The input options.
   * @param props Additional props for the input.
   * @returns {*} Input element.
   */
  renderInput = (input, props={}) => (
    <div key={input.name}>
      <label htmlFor={input.name}>{input.label}</label>
      <input type={input.type} name={input.name} onChange={(e) => {this.update(e)}} {...props} />
    </div>
  );

  /**
   * Renders all input elements from the inputs as provided in the props.
   * @param inputs
   * @returns {Array}
   */
  renderInputs(inputs) {
    let inputElements = [];
    for (let input of inputs) {
      switch (input.type) {
        case 'checkbox': {
          inputElements.push(this.renderInput(input, {checked: this.state[input.name]}));
          break;
        }
        default: inputElements.push(this.renderInput(input));
      }
    }
    return inputElements;
  }

  /**
   * Handles the form submission, passing the event and values to the submission callback provided in the props.
   * @param e Submission event.
   */
  onSubmit = (e) => {
    this.props.onSubmit(e, this.state);
  };

  render() {
    return (
      <div>
        <h3>{this.props.heading}</h3>
        {this.renderMessage()}
        <form onSubmit={this.onSubmit}>
          {this.renderInputs(this.props.inputs)}
          <input type="submit" value={this.props.actionName} />
        </form>
      </div>
    );
  }
}

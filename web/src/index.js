import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Jog(props) {
  return (
    <p>
      {props.jog.distance} / {props.jog.time} / {props.jog.average_speed}
    </p>
  );
}

class Jogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jogs: [],
    }
  }

  componentDidMount() {
    var that = this;
    var url = 'http://127.0.0.1:8080/api/hello/'

    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(data) {
        that.setState({ jogs: data });
      });
  }

  renderJog(i) {
    return <Jog jog={this.state.jogs[i]} />
  }

  render() {
    var rows = [];
    for (var i = 0; i < this.state.jogs.length; i++) {
      rows.push(this.renderJog(i));
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Jogs />,
  document.getElementById('root')
);

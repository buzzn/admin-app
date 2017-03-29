import React, { Component } from 'react';
import { connect } from 'react-redux';

export class RegisterResources extends Component {
  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
  }

  render() {
    return (
      <div>
        <h4>Readings</h4>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(RegisterResources);

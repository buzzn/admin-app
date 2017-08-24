import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logException } from '_util';

export default class PartErrorBoundary extends Component {
  static propTypes = {
    part: PropTypes.string.isRequired,
  };

  state = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // logException(error);
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div className={ `row ${this.props.part}` }>
          <div className="col-12">
            <h4>Something went completely wrong.</h4>
            <hr/>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              { this.state.error && this.state.error.toString() }
              <br/>
              { this.state.errorInfo.componentStack }
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

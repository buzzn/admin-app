import * as React from 'react';
import { logException } from '_util';

export default class PartErrorBoundary extends React.Component {
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
        <div className={`${this.props.part}`}>
          <h4>Something went completely wrong.</h4>
          <hr />
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

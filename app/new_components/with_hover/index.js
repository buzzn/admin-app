// flow bugs, see #4644, #4709, #4905
import * as React from 'react';

function withHover(Wrapped) {
  return class WithHover extends React.Component {
    state = {
      hover: false,
    };

    onMouseOver() {
      this.setState({ hover: true });
    }

    onMouseOut() {
      this.setState({ hover: false });
    }

    render() {
      return <Wrapped
        onMouseOver={ this.onMouseOver.bind(this) }
        onMouseOut={ this.onMouseOut.bind(this) }
        hover={ this.state.hover }
        {...this.props } />;
    }
  };
}

export default withHover;

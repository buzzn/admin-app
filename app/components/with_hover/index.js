import * as React from 'react';

function withHover(Wrapped) {
  return class WithHover extends React.Component {
    state = { hover: false };

    onMouseOver = () => {
      this.setState({ hover: true });
    }

    onMouseOut = () => {
      this.setState({ hover: false });
    }

    render() {
      return (
        <Wrapped
          hoverEvents={{
            onMouseOver: this.onMouseOver,
            onMouseOut: this.onMouseOut,
          }}
          hover={this.state.hover}
          {...this.props}
        />
      );
    }
  };
}

export default withHover;

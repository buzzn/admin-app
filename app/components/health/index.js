// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { MapStateToProps } from 'react-redux';

type Props = {
  health: {} | {
    build: string | { version: string, timestamp: string },
    database: string,
    redis: string,
    mongo: string,
    healthy: boolean,
  }
};

type State = {
  isOpen: boolean,
};

class Health extends React.Component<Props, State> {
  state = {
    isOpen: false,
  };

  switchWidget() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const { health } = this.props;
    const { isOpen } = this.state;

    return (
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: '9999',
        background: health.healthy ? '#e5e5e5' : 'red',
        padding: '10px',
      }}>
        <span onClick={ this.switchWidget.bind(this) } style={{ cursor: 'pointer', fontWeight: 'bold' }}>
          Server health:
        </span>
        { isOpen && <pre>{ JSON.stringify(health, null, 2) }</pre> }
      </div>
    );
  }
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({ health: state.app.health });

export default connect(mapStateToProps)(Health);

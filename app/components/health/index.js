import * as React from 'react';
import { connect } from 'react-redux';

class Health extends React.Component {
  state = { isOpen: false };

  switchWidget() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { health } = this.props;
    const { isOpen } = this.state;

    return (
      <div
        onClick={this.switchWidget.bind(this)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: '9999',
          background: health.healthy ? '#D4E157' : '#D84315',
          cursor: 'pointer',
          padding: '10px',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>Server health:</span>
        {isOpen && <pre>{JSON.stringify(health, null, 2)}</pre>}
      </div>
    );
  }
}

const mapStateToProps = state => ({ health: state.app.health });

export default connect(mapStateToProps)(Health);

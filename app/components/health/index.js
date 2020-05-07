import * as React from 'react';
import { connect } from 'react-redux';

class Health extends React.Component {
  state = { isOpen: false };

  switchWidget = () => {
    console.log('server health', this.props.health);
  }

  render() {
    const { health } = this.props;

    return (
      <div
        onClick={this.switchWidget}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: '9999',
          background: health.healthy ? '#D4E157' : '#D84315',
          cursor: 'pointer',
          borderRadius: '50%',
          border: '2px solid green',
          width: '18px',
          height: '18px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
        }}
      >
      </div>
    );
  }
}

const mapStateToProps = state => ({ health: state.app.health });

export default connect(mapStateToProps)(Health);

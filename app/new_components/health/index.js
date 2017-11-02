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
    healthy: string,
  }
};

const Health = ({ health }: Props) => (
  <div style={{
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: '9999',
    background: '#e5e5e5',
    padding: '10px' }}>
    <details style={{ whiteSpace: 'pre-wrap' }}>
      <pre>{ JSON.stringify(health, null, 2) }</pre>
    </details>
  </div>
);

const mapStateToProps: MapStateToProps<*, *, *> = state => ({ health: state.app.health });

export default connect(mapStateToProps)(Health);

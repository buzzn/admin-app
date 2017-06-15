import React from 'react';

export default ({ registers, Bubbles }) => (
  <div className="bubbles-wrapper row">
    <div className="col-6">
    </div>
    <div className="col-6">
      <div className="panel" style={{ position: 'relative' }}>
        <div style={{ width: '100%', height: '160px', display: 'inline-block', position: 'relative' }}>
          <Bubbles registers={ registers } />
        </div>
      </div>
    </div>
  </div>
);

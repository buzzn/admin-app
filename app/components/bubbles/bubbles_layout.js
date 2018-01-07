import * as React from 'react';

import './style.scss';

export default ({ registers, Bubbles }) => (
  <div className="bubbles-wrapper row">
    <div className="col-12">
      <div className="panel" style={{ position: 'relative' }}>
        <div style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative' }}>
          <Bubbles registers={registers} />
        </div>
      </div>
    </div>
  </div>
);

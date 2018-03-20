import * as React from 'react';

import './style.scss';

interface LoadingProps {
  minHeight: number;
  unit?: string;
}

const Loading = ({ minHeight, unit }: LoadingProps) => (
  <div style={{ minHeight: `${minHeight}${unit || 'rem'}`, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div className="la-ball-atom la-dark" style={{ margin: '0 auto' }}>
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default Loading;

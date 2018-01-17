import * as React from 'react';

import './style.scss';

interface LoadingProps {
  minHeight: number;
}

const Loading = ({ minHeight }: LoadingProps) => (
  <div style={{ minHeight: `${minHeight / 2}rem`, width: '100%' }}>
    <div className="la-ball-atom la-dark" style={{ margin: `${minHeight / 2}rem auto 0 auto` }}>
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default Loading;

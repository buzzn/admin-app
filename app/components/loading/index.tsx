import * as React from 'react';

import './style.scss';

interface LoadingProps {
  absolute?: boolean;
  minHeight?: number;
  unit?: string;
}

const Loading = ({ minHeight, unit, absolute }: LoadingProps) => {
  const style: React.CSSProperties = absolute
    ? {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      background: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }
    : {
      minHeight: `${minHeight}${unit || 'rem'}`,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    };

  return (
    <div style={style}>
      <div className="la-ball-atom la-dark" style={{ margin: '0 auto' }}>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default Loading;

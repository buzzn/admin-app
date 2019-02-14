import React, { useState, useEffect } from 'react';
import sample from 'lodash/sample';

const PureAdmin = () => {
  const [data, setData] = useState([]);
  const vals = '0123456789ABCDEF'.split('').concat([' ', ' ', ' ', ' ']);
  const cellWidth = 14;
  const cellHeight = 14;
  useEffect(() => {
    setInterval(() => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const rows = (screenHeight / cellHeight).toFixed(0);
      const cols = (screenWidth / cellWidth).toFixed(0);
      const newData = [...Array(parseInt(cols))].map(() => [...Array(parseInt(rows))].map(() => sample(vals)))
      // @ts-ignore
      setData(newData);
    }, 500);
  }, [true])

  // @ts-ignore
  return data.map((r, i) => r.map((c, j) => <div style={{ width: `${cellWidth}px`, height: `${cellHeight}px`, display: 'inline-block' }} key={`${i}-${j}`}>{c}</div>));
}

export default PureAdmin;

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import sample from 'lodash/sample';

// zalgo code from https://github.com/Marak/zalgo.js
const soul = {
  up: [
    '̍',
    '̎',
    '̄',
    '̅',
    '̿',
    '̑',
    '̆',
    '̐',
    '͒',
    '͗',
    '͑',
    '̇',
    '̈',
    '̊',
    '͂',
    '̓',
    '̈',
    '͊',
    '͋',
    '͌',
    '̃',
    '̂',
    '̌',
    '͐',
    '̀',
    '́',
    '̋',
    '̏',
    '̒',
    '̓',
    '̔',
    '̽',
    '̉',
    'ͣ',
    'ͤ',
    'ͥ',
    'ͦ',
    'ͧ',
    'ͨ',
    'ͩ',
    'ͪ',
    'ͫ',
    'ͬ',
    'ͭ',
    'ͮ',
    'ͯ',
    '̾',
    '͛',
    '͆',
    '̚',
  ],
  down: [
    '̖',
    '̗',
    '̘',
    '̙',
    '̜',
    '̝',
    '̞',
    '̟',
    '̠',
    '̤',
    '̥',
    '̦',
    '̩',
    '̪',
    '̫',
    '̬',
    '̭',
    '̮',
    '̯',
    '̰',
    '̱',
    '̲',
    '̳',
    '̹',
    '̺',
    '̻',
    '̼',
    'ͅ',
    '͇',
    '͈',
    '͉',
    '͍',
    '͎',
    '͓',
    '͔',
    '͕',
    '͖',
    '͙',
    '͚',
    '̣',
  ],
  mid: ['̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡', '҉'],
};

// @ts-ignore
const all = [].concat(soul.up, soul.down, soul.mid);

const zalgo = {};

function randomNumber(range) {
  return Math.floor(Math.random() * range);
}

function is_char(character) {
  let bool = false;
  all.filter((i) => {
    bool = i == character;
  });
  return bool;
}

// @ts-ignore
zalgo.heComes = function (text, options) {
  let result = '';

  options = options || {};
  options.up = options.up || true;
  options.mid = options.mid || true;
  options.down = options.down || true;
  options.size = options.size || 'maxi';
  let counts;
  text = text.split('');
  for (const l in text) {
    if (is_char(l)) {
      continue;
    }
    result += text[l];

    counts = { up: 0, down: 0, mid: 0 };

    switch (options.size) {
      case 'mini':
        counts.up = randomNumber(8);
        counts.min = randomNumber(2);
        counts.down = randomNumber(8);
        break;
      case 'maxi':
        counts.up = randomNumber(16) + 3;
        counts.min = randomNumber(4) + 1;
        counts.down = randomNumber(64) + 3;
        break;
      default:
        counts.up = randomNumber(8) + 1;
        counts.mid = randomNumber(6) / 2;
        counts.down = randomNumber(8) + 1;
        break;
    }

    const arr = ['up', 'mid', 'down'];
    for (const d in arr) {
      const index = arr[d];
      for (let i = 0; i <= counts[index]; i++) {
        if (options[index]) {
          result += soul[index][randomNumber(soul[index].length)];
        }
      }
    }
  }
  return result;
};

const PureAdmin = ({ hash }) => {
  const wrap = useRef(null);
  const [data, setData] = useState([]);
  const vals = (hash ? hash.split('') : '0123456789ABCDEF'.split('')).concat([' ', ' ', ' ', ' ']);
  // const cellWidth = 14;
  // const cellHeight = 14;
  const cellWidth = 20;
  const cellHeight = 14;
  const foreground = '#00ffbf';
  const background = '#1f4634';
  useEffect(() => {
    const time = setTimeout(() => {
      const screenWidth = wrap.current.clientWidth;
      const screenHeight = wrap.current.clientHeight;
      const rows = parseInt((screenHeight / cellHeight).toFixed(0));
      const cols = parseInt((screenWidth / cellWidth).toFixed(0));
      let newData = [...data];
      if (!newData.length) newData = [...Array(rows)].map(() => [...Array(cols)].map(() => (randomNumber(30) === 5 ? zalgo.heComes(sample(vals)) : sample(vals))));
      const diff = newData.length - rows;
      if (diff > 0) {
        for (let i = 0; i <= diff; i++) {
          newData.shift();
        }
      }
      newData.push([...Array(cols)].map(() => (randomNumber(30) === 5 ? zalgo.heComes(sample(vals)) : sample(vals))));
      // @ts-ignore
      setData(newData);
    }, 100);
    return () => clearTimeout(time);
  });

  return (
    <div ref={wrap} style={{ backgroundColor: background, overflow: 'hidden', width: '100%', height: '100%' }}>
      {data.map((r, i) => (
        <div key={i} style={{ width: '100%', height: `${cellHeight}px` }}>
          {r.map((c, j) => (
            <div
              style={{ width: `${cellWidth}px`, height: `${cellHeight}px`, display: 'inline-block', color: foreground }}
              key={`${i}-${j}`}
            >
              {c}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PureAdmin;

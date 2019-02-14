import React, { useState, useEffect } from 'react';
import sample from 'lodash/sample';

// zalgo code from https://github.com/Marak/zalgo.js
var soul = {
  "up": [
    '̍', '̎', '̄', '̅',
    '̿', '̑', '̆', '̐',
    '͒', '͗', '͑', '̇',
    '̈', '̊', '͂', '̓',
    '̈', '͊', '͋', '͌',
    '̃', '̂', '̌', '͐',
    '̀', '́', '̋', '̏',
    '̒', '̓', '̔', '̽',
    '̉', 'ͣ', 'ͤ', 'ͥ',
    'ͦ', 'ͧ', 'ͨ', 'ͩ',
    'ͪ', 'ͫ', 'ͬ', 'ͭ',
    'ͮ', 'ͯ', '̾', '͛',
    '͆', '̚'
  ],
  "down": [
    '̖', '̗', '̘', '̙',
    '̜', '̝', '̞', '̟',
    '̠', '̤', '̥', '̦',
    '̩', '̪', '̫', '̬',
    '̭', '̮', '̯', '̰',
    '̱', '̲', '̳', '̹',
    '̺', '̻', '̼', 'ͅ',
    '͇', '͈', '͉', '͍',
    '͎', '͓', '͔', '͕',
    '͖', '͙', '͚', '̣'
  ],
  "mid": [
    '̕', '̛', '̀', '́',
    '͘', '̡', '̢', '̧',
    '̨', '̴', '̵', '̶',
    '͜', '͝', '͞',
    '͟', '͠', '͢', '̸',
    '̷', '͡', ' ҉'
  ]
};

// @ts-ignore
var all = [].concat(soul.up, soul.down, soul.mid);

var zalgo = {};

function randomNumber(range) {
  return Math.floor(Math.random() * range);
};

function is_char(character) {
  var bool = false;
  all.filter(function (i) {
    bool = (i == character);
  });
  return bool;
}

// @ts-ignore
zalgo.heComes = function (text, options) {
  let result = '';

  options = options || {};
  options["up"] = options["up"] || true;
  options["mid"] = options["mid"] || true;
  options["down"] = options["down"] || true;
  options["size"] = options["size"] || "maxi";
  var counts;
  text = text.split('');
  for (var l in text) {
    if (is_char(l)) { continue; }
    result = result + text[l];

    counts = { "up": 0, "down": 0, "mid": 0 };

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

    var arr = ["up", "mid", "down"];
    for (var d in arr) {
      var index = arr[d];
      for (var i = 0; i <= counts[index]; i++) {
        if (options[index]) {
          result = result + soul[index][randomNumber(soul[index].length)];
        }
      }
    }
  }
  return result;
};

const PureAdmin = () => {
  const [data, setData] = useState([]);
  const vals = '0123456789ABCDEF'.split('').concat([' ', ' ', ' ', ' ']);
  const cellWidth = 14;
  const cellHeight = 14;
  const foreground = '#00ffbf';
  const background = '#1f4634';
  useEffect(() => {
    setInterval(() => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const rows = (screenHeight / cellHeight).toFixed(0);
      const cols = (screenWidth / cellWidth).toFixed(0);
      // @ts-ignore
      const newData = [...Array(parseInt(cols))].map(() => [...Array(parseInt(rows))].map(() => randomNumber(30) === 5 ? zalgo.heComes(sample(vals)) : sample(vals)))
      // @ts-ignore
      setData(newData);
    }, 500);
  }, [true])

  // @ts-ignore
  return <div style={{ backgroundColor: background, width: '100%', height: '100%' }}>{data.map((r, i) => r.map((c, j) => <div style={{ width: `${cellWidth}px`, height: `${cellHeight}px`, display: 'inline-block', color: foreground }} key={`${i}-${j}`}>{c}</div>))}</div>;
}

export default PureAdmin;

const chance = require('chance').Chance();

import Avatar from 'images/default_person.jpg';
import GroupImage from 'images/energygroup_noimage_01.jpg';

export const persons = num => [...Array(num).keys()].map(i => ({
  id: i.toString(),
  type: 'person',
  firstName: chance.first(),
  lastName: chance.last(),
  image: Avatar,
}));

export const organizations = num => [...Array(num).keys()].map(i => ({
  id: i.toString(),
  type: 'organization',
  name: chance.company(),
}));

export const groups = num => [...Array(num).keys()].map(i => ({
  id: i.toString(),
  name: chance.company(),
  image: GroupImage,
}));

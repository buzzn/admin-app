const chance = require('chance').Chance();

export const persons = num => [...Array(num).keys()].map(i => ({
  id: i,
  type: 'person',
  firstName: chance.first(),
  lastName: chance.last(),
}));

export const organizations = num => [...Array(num).keys()].map(i => ({
  id: i,
  type: 'organization',
  name: chance.company(),
}));

export const groups = num => [...Array(num).keys()].map(i => ({
  id: i,
  name: chance.company(),
}));

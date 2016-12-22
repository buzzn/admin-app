import { expect } from 'chai';
import { appReducer } from '../reducers';

// using arrow functions in mocha is discouraged, but for the most cases it's ok
// https://mochajs.org/#arrow-functions
describe('app reducers', () => {
  it('should return initial state', () => {
    expect(appReducer(undefined, {})).to.eql({});
  });
});

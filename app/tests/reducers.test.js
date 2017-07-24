import { initialState, appReducer } from '../reducers';

describe('app reducers', () => {
  test('should return initial state', () => {
    expect(appReducer(undefined, {})).toBe(initialState);
  });
});

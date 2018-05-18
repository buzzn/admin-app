import React from 'react';
import renderer from 'react-test-renderer';
import Loading from 'components/loading';

describe('loading tests', () => {
  test('default unit (rem)', () => {
    const tree = renderer
      .create(<Loading {...{ minHeight: 20 }} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('px', () => {
    const tree = renderer
      .create(<Loading {...{ minHeight: 20, unit: 'px' }} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

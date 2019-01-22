import React from 'react';
import renderer from 'react-test-renderer';
import FieldInput from 'components/field_input';

describe('field input tests', () => {
  const props = {
    label: 'label',
    input: { value: 'value' },
    meta: { active: false, touched: false, error: '' },
  };

  test('inactive', () => {
    const tree = renderer.create(<FieldInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('active', () => {
    const tree = renderer.create(<FieldInput {...{ ...props, meta: { active: true, touched: false, error: '' } }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('error', () => {
    const tree = renderer.create(<FieldInput {...{ ...props, meta: { active: false, touched: true, error: 'error' } }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

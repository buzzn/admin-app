import React from 'react';
import renderer from 'react-test-renderer';
import EditableSelect from 'components/editable_select';

describe('editable select tests', () => {
  const props = {
    field: { enum: ['first', 'second', 'third'] },
    editMode: true,
    input: { name: 'select', value: 'second' },
    meta: { active: false, dirty: false, error: '', touched: false },
    prefix: 'objPrefix',
  };

  test('basic view and edit rendering', () => {
    const noVal = renderer
      .create(<EditableSelect {...{ ...props, editMode: false, input: { name: 'select' } }} />)
      .toJSON();
    expect(noVal).toMatchSnapshot();

    const view = renderer.create(<EditableSelect {...{ ...props, editMode: false }} />).toJSON();
    expect(view).toMatchSnapshot();

    const edit = renderer.create(<EditableSelect {...props} />).toJSON();
    expect(edit).toMatchSnapshot();
  });

  test('raw value output', () => {
    const view = renderer.create(<EditableSelect {...{ ...props, editMode: false, withValue: true }} />).toJSON();
    expect(view).toMatchSnapshot();

    const edit = renderer.create(<EditableSelect {...{ ...props, withValue: true }} />).toJSON();
    expect(edit).toMatchSnapshot();
  });

  test('active field', () => {
    const edit = renderer.create(<EditableSelect {...{ ...props, meta: { active: true } }} />).toJSON();
    expect(edit).toMatchSnapshot();
  });

  test('with error', () => {
    const edit = renderer
      .create(<EditableSelect {...{ ...props, meta: { dirty: true, error: 'error', touched: true } }} />)
      .toJSON();
    expect(edit).toMatchSnapshot();
  });

  test('with default value', () => {
    const edit = renderer
      .create(<EditableSelect {...{ ...props, defaultValue: { value: 'default', label: 'Default' } }} />)
      .toJSON();
    expect(edit).toMatchSnapshot();
  });

  test('list override', () => {
    const edit = renderer
      .create(
        <EditableSelect
          {...{
            ...props,
            listOverride: [{ value: 'override1', label: 'Override1' }, { value: 'override2', label: 'Override2' }],
          }}
        />,
      )
      .toJSON();
    expect(edit).toMatchSnapshot();
  });

  test('no default value', () => {
    const edit = renderer.create(<EditableSelect {...{ ...props, noDefault: true }} />).toJSON();
    expect(edit).toMatchSnapshot();
  });

  test('no value translations', () => {
    const edit = renderer.create(<EditableSelect {...{ ...props, noValTranslations: true }} />).toJSON();
    expect(edit).toMatchSnapshot();
  });

  test('override data', () => {
    const edit = renderer
      .create(
        <EditableSelect {...{ ...props, overrideData: { override: 'Override' }, input: { name: 'admin.override' } }} />,
      )
      .toJSON();
    expect(edit).toMatchSnapshot();
  });

  test('prefix', () => {
    const edit = renderer.create(<EditableSelect {...{ ...props, prefix: 'customPrefix' }} />).toJSON();
    expect(edit).toMatchSnapshot();
  });

  test('values prefix', () => {
    const edit = renderer.create(<EditableSelect {...{ ...props, valuesPrefix: 'customPrefix' }} />).toJSON();
    expect(edit).toMatchSnapshot();
  });

  test('with label', () => {
    const edit = renderer
      .create(<EditableSelect {...{ ...props, withLabel: true, input: { name: 'select', value: '' } }} />)
      .toJSON();
    expect(edit).toMatchSnapshot();

    const active = renderer
      .create(<EditableSelect {...{ ...props, withLabel: true, meta: { active: true } }} />)
      .toJSON();
    expect(active).toMatchSnapshot();
  });
});

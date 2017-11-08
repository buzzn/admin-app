// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import EditableSelect from 'new_components/editable_select';

const props = {
  prefix: '',
  editMode: false,
  noValTranslations: true,
  input: { value: 'test data' },
  listOverride: [{ value: 'another', label: 'Another' }, { value: 'test data', label: 'Test data' }],
  meta: { touched: false, error: null },
};

storiesOf('Atoms/EditableSelect')
  .add('view', () => {
    return <EditableSelect {...props}/>;
  })
  .add('edit', () => {
    return <EditableSelect {...props} editMode={ true }/>;
  })
  .add('error', () => {
    return <EditableSelect {...props} editMode={ true } meta={{ touched: true, error: 'some error' }}/>;
  });

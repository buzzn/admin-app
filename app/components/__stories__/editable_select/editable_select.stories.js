import React from 'react';
import { storiesOf } from '@storybook/react';
import EditableSelect from 'components/editable_select';

const props = {
  prefix: '',
  editMode: false,
  noValTranslations: true,
  input: { value: 'test data' },
  listOverride: [{ value: 'another', label: 'Another' }, { value: 'test data', label: 'Test data' }],
  meta: { touched: false, error: null },
};

storiesOf('Atoms/EditableSelect')
  .add('view', () => <EditableSelect {...props} />)
  .add('edit', () => <EditableSelect {...props} editMode={true} />)
  .add('error', () => <EditableSelect {...props} editMode={true} meta={{ touched: true, error: 'some error' }} />);

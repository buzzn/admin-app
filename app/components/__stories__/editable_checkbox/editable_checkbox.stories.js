import React from 'react';
import { storiesOf } from '@storybook/react';
import EditableCheckbox from 'components/editable_checkbox';

const chance = require('chance').Chance();

const props = {
  editMode: false,
  input: { value: chance.word() },
  meta: { touched: false, error: null },
};

storiesOf('Atoms/EditableCheckbox')
  .add('view', () => <EditableCheckbox {...props} />)
  .add('edit', () => <EditableCheckbox {...props} editMode={true} />)
  .add('error', () => <EditableCheckbox {...props} editMode={true} meta={{ touched: true, error: 'some error' }} />);

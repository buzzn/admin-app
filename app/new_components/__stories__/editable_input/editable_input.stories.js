import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import EditableInput from '../../editable_input';

const props = {
  editMode: false,
  input: { value: 'test data' },
  meta: { touched: false, error: null } };

storiesOf('Atoms/EditableInput')
  .addDecorator(withKnobs)
  .add('view', () => {
    return <EditableInput {...props}/>;
  })
  .add('edit', () => {
    return <EditableInput {...props} editMode={ true }/>;
  })
  .add('error', () => {
    return <EditableInput {...props} editMode={ true } meta={{ touched: true, error: 'some error' }}/>;
  })
  .add('dynamic', () => {
    const dynamicProps = {
      editMode: boolean('Edit mode', false),
      input: { value: text('Value', 'test data') },
      meta: { touched: boolean('Touched', false), error: text('Error message', '') },
    };
    return <EditableInput {...dynamicProps}/>;
  });

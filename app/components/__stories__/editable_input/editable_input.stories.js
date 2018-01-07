import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import EditableInput from 'components/editable_input';

const chance = require('chance').Chance();

const props = {
  editMode: false,
  input: { value: chance.sentence() },
  meta: { touched: false, error: null },
};

storiesOf('Atoms/EditableInput')
  .addDecorator(withKnobs)
  .add('view', () => <EditableInput {...props} />)
  .add('edit', () => <EditableInput {...props} editMode={true} />)
  .add('error', () => <EditableInput {...props} editMode={true} meta={{ touched: true, error: 'some error' }} />)
  .add('dynamic', () => {
    const dynamicProps = {
      editMode: boolean('Edit mode', false),
      input: { value: text('Value', 'test data') },
      meta: { touched: boolean('Touched', false), error: text('Error message', '') },
    };
    return <EditableInput {...dynamicProps} />;
  });

import React from 'react';
import { reduxForm } from 'redux-form';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import backgrounds from '@storybook/addon-backgrounds';
import EditableInput from 'components/editable_input';
import TwoColField from 'components/two_col_field';

const chance = require('chance').Chance();

const DecoratedTwoColField = reduxForm({ form: 'testForm' })(TwoColField);

const props = {
  prefix: 'admin.persons',
  name: 'firstName',
  validationRules: {},
  editMode: false,
  input: { value: chance.first(), onChange: action('change') },
  meta: { touched: false, error: null },
};

storiesOf('Molecules/TwoColField/single')
  .addDecorator(withKnobs)
  .addDecorator(backgrounds([{ name: 'twitter', value: '#00aced' }, { name: 'facebook', value: '#3b5998' }]))
  .add('view', () => <DecoratedTwoColField {...props} component={EditableInput} />)
  .add('edit', () => <DecoratedTwoColField {...{ ...props, editMode: true }} component={EditableInput} />)
  .add('error', () => (
      <DecoratedTwoColField
        {...{ ...props, editMode: true, meta: { touched: true, error: 'some error' } }}
        component={EditableInput}
      />
  ));

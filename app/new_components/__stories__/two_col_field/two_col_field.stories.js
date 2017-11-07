import React from 'react';
import { reduxForm } from 'redux-form';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import backgrounds from '@storybook/addon-backgrounds';
import Provider from '../__util__/provider';
import EditableInput from 'new_components/editable_input';
import TwoColField from 'new_components/two_col_field';

const DecoratedTwoColField = reduxForm({ form: 'testForm' })(TwoColField)

const props = {
  prefix: 'admin.persons',
  name: 'firstName',
  validationRules: {},
  editMode: false,
  input: { value: 'test data', onChange: action('change') },
  meta: { touched: false, error: null },
};

storiesOf('Molecules/TwoColField')
  .addDecorator(withKnobs)
  .addDecorator(backgrounds([
    { name: 'twitter', value: '#00aced' },
    { name: 'facebook', value: '#3b5998' },
  ]))
  .addDecorator(story => <Provider story={ story() } />)
  .add('input view', () => {
    return <DecoratedTwoColField {...props} component={ EditableInput }/>;
  })
  .add('input edit', () => {
    return <DecoratedTwoColField {...{ ...props, editMode: true }} component={ EditableInput }/>;
  })
  .add('input error', () => {
    return <DecoratedTwoColField {...{ ...props, editMode: true, meta: { touched: true, error: 'some error' } }} component={ EditableInput }/>;
  });

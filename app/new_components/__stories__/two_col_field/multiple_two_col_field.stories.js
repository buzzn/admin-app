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

const propsFName = {
  prefix: 'admin.persons',
  name: 'firstName',
  validationRules: {},
  editMode: false,
  input: { value: 'first name', onChange: action('change first name') },
  meta: { touched: false, error: null },
};

const propsLName = {
  prefix: 'admin.persons',
  name: 'lastName',
  validationRules: {},
  editMode: false,
  input: { value: 'last name', onChange: action('change last name') },
  meta: { touched: false, error: null },
};

storiesOf('Molecules/TwoColField/multiple')
  .addDecorator(withKnobs)
  .addDecorator(backgrounds([
    { name: 'twitter', value: '#00aced' },
    { name: 'facebook', value: '#3b5998' },
  ]))
  .addDecorator(story => <Provider story={ story() } />)
  .add('multi input view', () => {
    return [
      <DecoratedTwoColField key={ 1 } {...propsFName} component={ EditableInput }/>,
      <DecoratedTwoColField key={ 2 } {...propsLName} component={ EditableInput }/>,
    ];
  })
  .add('multi input edit', () => {
    return [
      <DecoratedTwoColField key={ 1 } {...{ ...propsFName, editMode: true }} component={ EditableInput }/>,
      <DecoratedTwoColField key={ 2 } {...{ ...propsLName, editMode: true }} component={ EditableInput }/>,
    ];
  })
  .add('multi input error', () => {
    return [
      <DecoratedTwoColField key={ 1 } {...{ ...propsFName, editMode: true, meta: { touched: true, error: 'some error' } }} component={ EditableInput }/>,
      <DecoratedTwoColField key={ 2 } {...{ ...propsLName, editMode: true, meta: { touched: true, error: 'some error' } }} component={ EditableInput }/>,
    ];
  });

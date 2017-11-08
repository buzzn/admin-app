import React from 'react';
import { reduxForm } from 'redux-form';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import Provider from '../__util__/provider';
import EditableInput from 'new_components/editable_input';
import EditableSelect from 'new_components/editable_select';
import TwoColField from 'new_components/two_col_field';

const chance = require('chance').Chance();

const DecoratedTwoColField = reduxForm({ form: 'testForm' })(TwoColField)

const propsFName = {
  prefix: 'admin.persons',
  name: 'firstName',
  validationRules: {},
  editMode: false,
  input: { value: chance.first(), onChange: action('change first name') },
  meta: { touched: false, error: null },
};

const propsLName = {
  prefix: 'admin.persons',
  name: 'lastName',
  validationRules: {},
  editMode: false,
  input: { value: chance.last(), onChange: action('change last name') },
  meta: { touched: false, error: null },
};

const propsPrefix = {
  prefix: 'admin.persons',
  name: 'prefix',
  validationRules: {},
  editMode: false,
  noValTranslations: true,
  input: { value: 'dr' },
  listOverride: [{ value: 'prof', label: 'Prof' }, { value: 'dr', label: 'Dr' }],
  meta: { touched: false, error: null },
};

storiesOf('Molecules/TwoColField/multiple')
  .addDecorator(withKnobs)
  .addDecorator(story => <Provider story={ story() } />)
  .add('view', () => {
    return [
      <DecoratedTwoColField key={ 1 } {...propsFName} component={ EditableInput }/>,
      <DecoratedTwoColField key={ 2 } {...propsLName} component={ EditableInput }/>,
      <DecoratedTwoColField key={ 3 } {...propsPrefix} component={ EditableSelect }/>,
    ];
  })
  .add('edit', () => {
    return [
      <DecoratedTwoColField key={ 1 } {...{ ...propsFName, editMode: true }} component={ EditableInput }/>,
      <DecoratedTwoColField key={ 2 } {...{ ...propsLName, editMode: true }} component={ EditableInput }/>,
      <DecoratedTwoColField key={ 3 } {...{ ...propsPrefix, editMode: true }} component={ EditableSelect }/>,
    ];
  })
  .add('error', () => {
    return [
      <DecoratedTwoColField key={ 1 } {...{ ...propsFName, editMode: true, meta: { touched: true, error: 'some error' } }} component={ EditableInput }/>,
      <DecoratedTwoColField key={ 2 } {...{ ...propsLName, editMode: true, meta: { touched: true, error: 'some error' } }} component={ EditableInput }/>,
      <DecoratedTwoColField key={ 3 } {...{ ...propsPrefix, editMode: true, meta: { touched: true, error: 'some error' } }} component={ EditableSelect }/>,
    ];
  });

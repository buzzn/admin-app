// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import FieldToggle from 'components/field_toggle';

const props = {
  submitForm: action('submit form'),
  input: { value: true },
  meta: { touched: false, error: null },
};

storiesOf('Atoms/FieldToggle')
  .addDecorator(withKnobs)
  .add('view', () => {
    return <FieldToggle {...props} input={{ value: boolean('Value', true) }}/>;
  })
  .add('error', () => {
    return <FieldToggle {...props} input={{ value: boolean('Value', true) }} meta={{ touched: true, error: 'some error' }}/>;
  });

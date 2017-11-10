// @flow
import React from 'react';
import { reduxForm } from 'redux-form';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import Provider from '../__util__/provider';
import AddReading from 'components/system/add_reading';

const DecoratedAddReading = reduxForm({ form: 'testForm' })(AddReading)

storiesOf('Molecules/AddReading')
  .addDecorator(withKnobs)
  .addDecorator(story => <Provider story={ story() } />)
  .add('modal', () => {
    const props = {
      isOpen: boolean('Modal open', true),
      toggle: action('Toggle modal'),
      addReading: action('Add reading'),
      validationRules: {},
    };

    return <DecoratedAddReading {...props}/>;
  });

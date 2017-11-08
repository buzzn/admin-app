import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { SignIn } from 'new_components/sign_in';

const props = {
  setLogin: action('Set login'),
  setPassword: action('Set password'),
  startAuth: action('Start auth'),
  username: 'example@example.com',
  password: 'Example123',
  error: null,
};

storiesOf('Molecules/SignIn')
  .addDecorator(withKnobs)
  .add('No error', () => {
    return <SignIn {...props}/>;
  })
  .add('Error', () => {
    return <SignIn {...{ ...props, error: 'Wrong credentials' }}/>;
  });

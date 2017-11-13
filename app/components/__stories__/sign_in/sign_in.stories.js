// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { SignInIntl } from 'components/sign_in';

const props = {
  setLogin: action('Set login'),
  setPassword: action('Set password'),
  startAuth: action('Start auth'),
  username: 'example@example.com',
  password: 'Example123',
  error: '',
};

storiesOf('Molecules/SignIn')
  .add('Empty', () => {
    return <SignInIntl {...{ ...props, username: '', password: '' }}/>;
  })
  .add('No error', () => {
    return <SignInIntl {...props}/>;
  })
  .add('Error', () => {
    return <SignInIntl {...{ ...props, error: 'Wrong credentials' }}/>;
  });

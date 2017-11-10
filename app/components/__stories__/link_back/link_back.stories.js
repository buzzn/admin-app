// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-router';
import LinkBack from 'components/link_back';

storiesOf('Atoms/LinkBack')
  .addDecorator(StoryRouter())
  .add('with link', () => {
    return <LinkBack url="#" title="Back link"/>;
  })
  .add('no link', () => {
    return <LinkBack title="Just title"/>;
  });

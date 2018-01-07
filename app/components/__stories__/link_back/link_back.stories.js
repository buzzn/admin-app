import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-router';
import LinkBack from 'components/link_back';

storiesOf('Atoms/LinkBack')
  .addDecorator(StoryRouter())
  .add('with link', () => <LinkBack url="#" title="Back link" />)
  .add('no link', () => <LinkBack title="Just title" />);

// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-router';
import PowertakersList from 'components/powertakers/powertakers_list';
import { persons, organizations } from '../__util__/generators';

const props = {
  url: '#',
  loading: false,
  powertakers: (persons(10)).concat(organizations(10)).map(p => ({ ...p, contractId: '' })),
};

storiesOf('Molecules/PowertakersList')
  .addDecorator(StoryRouter())
  .add('view', () => {
    return <PowertakersList {...props}/>;
  });

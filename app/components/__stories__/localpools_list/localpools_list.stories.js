// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-router';
import { action } from '@storybook/addon-actions';
import { groups } from '../__util__/generators';
import { LocalpoolsListIntl } from 'components/localpools_list';

const props = {
  loadGroups: action('load groups'),
  groups: groups(10),
  groupsStats: { '1': { fire: true, solar: true } },
};

storiesOf('Molecules/LocalpoolsList')
  .addDecorator(StoryRouter())
  .add('view', () => {
    return <LocalpoolsListIntl {...props} />;
  });

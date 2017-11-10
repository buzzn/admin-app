// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { GroupStats } from 'components/group_stats';

storiesOf('Atoms/GroupStats')
  .add('basic', () => {
    const groupStats = {
      production: '20 kWh',
      consumption: '20 kWh',
      autarchy: '0.88',
      solar: true,
      fire: true,
    };

    return <GroupStats {...{ groupStats }}/>;
  });

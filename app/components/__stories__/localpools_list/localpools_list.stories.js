// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-router';
import { action } from '@storybook/addon-actions';
// import Provider from '../__util__/provider';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { groups } from '../__util__/generators';
import { LocalpoolsListIntl } from 'components/localpools_list';

const mockStore = configureStore();
const store = mockStore({
  ui: {
    isMenuOpened: true,
  },
});

const props = {
  loadGroups: action('load groups'),
  groups: groups(10),
  groupsStats: { '1': { fire: true, solar: true } },
};

storiesOf('Molecules/LocalpoolsList')
  .addDecorator(StoryRouter())
  // .addDecorator(story => <Provider story={ story() } />)
  .addDecorator(story => <Provider store={ store }>{ story() }</Provider>)
  .add('view', () => {
    return <LocalpoolsListIntl {...props} />;
  });

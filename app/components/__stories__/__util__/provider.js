import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import { browserHistory } from 'react-router';

const configureStore = () => createStore(state => state);
const store = configureStore(browserHistory, {});

export default function Provider({ story }) {
  return (
    <ReduxProvider store={ store }>
      { story }
    </ReduxProvider>
  );
}

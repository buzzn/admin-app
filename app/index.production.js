import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configure_store';
import Root from './root';

configureStore();

render(
  <Provider store={configureStore()}>
    <Root />
  </Provider>,
  document.querySelector('#root')
);

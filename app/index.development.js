import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import Redbox from 'redbox-react';
import configureStore from './configure_store';
import Root from './root';

configureStore();

render(
  <AppContainer errorReporter={Redbox}>
    <Provider store={configureStore()}>
      <Root />
    </Provider>
  </AppContainer>,
  document.querySelector('#root')
);

if (module.hot) {
  module.hot.accept('./root', () => {
    // workaround for HMR
    require('./root').default;

    render(
      <AppContainer errorReporter={Redbox}>
        <Root />
      </AppContainer>,
      document.querySelector('#root')
    );
  });
}

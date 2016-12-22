import createSagaMiddleware from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Auth from '@buzzn/module_auth';
import appSaga from './sagas';
import RootReducer from './reducers';

function* rootSaga() {
  yield [call(appSaga), call(Auth.sagas)];
}

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(RootReducer,
    {},
    compose(applyMiddleware(sagaMiddleware, thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  sagaMiddleware.run(rootSaga);

  return store;
}

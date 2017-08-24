import createSagaMiddleware from 'redux-saga';
import { call, all } from 'redux-saga/effects';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Auth from '@buzzn/module_auth';
import Bubbles from '@buzzn/module_bubbles';
import Charts from '@buzzn/module_charts';
import appSaga from './sagas';
import Groups from './groups';
import Meters from './meters';
import Registers from './registers';
import Users from './users';
import Contracts from './contracts';
import ValidationRules from './validation_rules';
import RootReducer from './reducers';
import { logException } from './_util';

function* rootSaga() {
  yield all([
    call(Auth.sagas),
    call(Bubbles.sagas, logException),
    call(Charts.sagas),
    call(Groups.sagas),
    call(Meters.sagas),
    call(Registers.sagas),
    call(Users.sagas),
    call(Contracts.sagas),
    call(ValidationRules.sagas),
    call(appSaga),
  ]);
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

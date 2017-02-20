import createSagaMiddleware from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Auth from '@buzzn/module_auth';
import Bubbles from '@buzzn/module_bubbles';
import Charts from '@buzzn/module_charts';
import appSaga from './sagas';
import Profiles from './profiles';
import Groups from './groups';
import Meters from './meters';
import Friends from './friends';
import Registers from './registers';
import Users from './users';
import RootReducer from './reducers';

function* rootSaga() {
  yield [
    call(Auth.sagas),
    call(Bubbles.sagas),
    call(Charts.sagas),
    call(Profiles.sagas),
    call(Groups.sagas),
    call(Meters.sagas),
    call(Friends.sagas),
    call(Registers.sagas),
    call(Users.sagas),
    call(appSaga),
  ];
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

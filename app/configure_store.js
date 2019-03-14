import createSagaMiddleware from 'redux-saga';
import { call, all } from 'redux-saga/effects';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Auth from '@buzzn/module_auth';
import appSaga from 'sagas';
import Groups from 'groups';
import Meters from 'meters';
import Registers from 'registers';
import Users from 'users';
import Organizations from 'organizations';
import Contracts from 'contracts';
import Readings from 'readings';
import MarketLocations from 'market_locations';
import BillingCycles from 'billing_cycles';
import Billings from 'billings';
import Tariffs from 'tariffs';
import Devices from 'devices';
import WebsiteForms from 'website_forms';
import ValidationRules from 'validation_rules';
import RootReducer from 'reducers';

function* rootSaga() {
  yield all([
    call(Auth.sagas),
    call(Groups.sagas),
    call(Meters.sagas),
    call(Registers.sagas),
    call(Users.sagas),
    call(Organizations.sagas),
    call(Contracts.sagas),
    call(Readings.sagas),
    call(MarketLocations.sagas),
    call(BillingCycles.sagas),
    call(Billings.sagas),
    call(Tariffs.sagas),
    call(Devices.sagas),
    call(WebsiteForms.sagas),
    call(ValidationRules.sagas),
    call(appSaga),
  ]);
}

function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    RootReducer,
    {},
    composeEnhancers(
      applyMiddleware(sagaMiddleware, thunk),
    ),
  );

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

const store = configureStore();

export default store;

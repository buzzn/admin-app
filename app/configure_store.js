import createSagaMiddleware from 'redux-saga';
import { call, all } from 'redux-saga/effects';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Auth from '@buzzn/module_auth';
import appSaga from 'sagas';
import BillingCycles from 'billing_cycles';
import Billings from 'billings';
import Comments from 'comments';
import Contracts from 'contracts';
import Devices from 'devices';
import Groups from 'groups';
import MarketLocations from 'market_locations';
import Meters from 'meters';
import Organizations from 'organizations';
import Readings from 'readings';
import Registers from 'registers';
import Reports from 'reports';
import RootReducer from 'reducers';
import Tariffs from 'tariffs';
import Users from 'users';
import ValidationRules from 'validation_rules';
import WebsiteForms from 'website_forms';

function* rootSaga() {
  yield all([
    call(appSaga),
    call(Auth.sagas),
    call(BillingCycles.sagas),
    call(Billings.sagas),
    call(Comments.sagas),
    call(Contracts.sagas),
    call(Devices.sagas),
    call(Groups.sagas),
    call(MarketLocations.sagas),
    call(Meters.sagas),
    call(Organizations.sagas),
    call(Readings.sagas),
    call(Registers.sagas),
    call(Reports.sagas),
    call(Tariffs.sagas),
    call(Users.sagas),
    call(ValidationRules.sagas),
    call(WebsiteForms.sagas),
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

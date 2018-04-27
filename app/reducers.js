import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import Auth from '@buzzn/module_auth';
import Bubbles from '@buzzn/module_bubbles';
import Charts from '@buzzn/module_charts';
import config from 'config';
import { constants } from 'actions';
import Groups from 'groups';
import Meters from 'meters';
import Registers from 'registers';
import Users from 'users';
import Contracts from 'contracts';
import Readings from 'readings';
import MarketLocations from 'market_locations';
import BillingCycles from 'billing_cycles';

// in this case initialState includes apiUrl and apiPath, so it will just copy this params into app state.
export function configReducer(state = config) {
  return state;
}

export const initialState = {
  loading: false,
  userMe: {},
  userMeValidationRules: {},
  uiVer: '',
  health: {},
  appLoading: true,
  ui: {
    devMode: false,
    groupsListTiles: false,
    tableSort: {},
  },
  incompleteScreen: [],
};

export function tableSortReducer(state, action) {
  switch (action.type) {
    case constants.SET_TABLE_SORT:
      return { ...state, [action.table]: action.sort };

    default:
      return state;
  }
}

export function uiReducer(state, action) {
  switch (action.type) {
    case constants.SET_UI:
      return { ...state, ...action.ui };
    case constants.SET_TABLE_SORT:
      return { ...state, tableSort: tableSortReducer(state.tableSort, action) };

    default:
      return state;
  }
}

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case constants.LOADING:
      return { ...state, loading: true };
    case constants.LOADED:
      return { ...state, loading: false };
    case constants.SET_USER_ME:
      return { ...state, userMe: action.userMe };
    case constants.SET_USER_ME_VALIDATION_RULES:
      return { ...state, userMeValidationRules: action.userMeValidationRules };

    case constants.SET_HEALTH:
      return { ...state, health: action.health };

    case constants.SET_APP_LOADING:
      return { ...state, appLoading: action.appLoading };

    case constants.SET_UI:
    case constants.SET_TABLE_SORT:
      return { ...state, ui: uiReducer(state.ui, action) };

    case constants.SET_INCOMPLETE_SCREEN:
      return { ...state, incompleteScreen: action.incompleteScreen };

    default:
      return state;
  }
}

export default combineReducers({
  // apiUrl and apiPath will be located in 'config' property
  config: configReducer,
  form: formReducer,
  auth: Auth.reducers,
  bubbles: Bubbles.reducers,
  charts: Charts.reducers,
  app: appReducer,
  meters: Meters.reducers,
  groups: Groups.reducers,
  registers: Registers.reducers,
  users: Users.reducers,
  contracts: Contracts.reducers,
  readings: Readings.reducers,
  marketLocations: MarketLocations.reducers,
  billingCycles: BillingCycles.reducers,
});

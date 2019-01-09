import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import Auth from '@buzzn/module_auth';
import config from 'config';
import { constants } from 'actions';
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

// in this case initialState includes apiUrl and apiPath, so it will just copy this params into app state.
export function configReducer(state = config) {
  return state;
}

export const initialState = {
  loading: false,
  userMe: {},
  userMeValidationRules: {},
  uiVer: '',
  buildDate: process.env.buildDate,
  versionMismatch: false,
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

    case constants.SET_VERSION_MISMATCH:
      return { ...state, versionMismatch: action.versionMismatch };

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
  app: appReducer,
  auth: Auth.reducers,
  billingCycles: BillingCycles.reducers,
  billings: Billings.reducers,
  // apiUrl and apiPath will be located in 'config' property
  config: configReducer,
  contracts: Contracts.reducers,
  devices: Devices.reducers,
  groups: Groups.reducers,
  form: formReducer,
  marketLocations: MarketLocations.reducers,
  meters: Meters.reducers,
  organizations: Organizations.reducers,
  readings: Readings.reducers,
  registers: Registers.reducers,
  tariffs: Tariffs.reducers,
  users: Users.reducers,
  websiteForms: WebsiteForms.reducers,
});

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import Auth from '@buzzn/module_auth';
import config from 'config';
import { constants } from 'actions';
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
import Tariffs from 'tariffs';
import Users from 'users';
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
    tableFilter: {},
  },
  incompleteScreen: [],
};

export function uiReducer(state, action) {
  switch (action.type) {
    case constants.SET_UI:
      return { ...state, ...action.ui };
    case constants.SET_TABLE_SORT:
      return { ...state, tableSort: { ...state.tableSort, [action.table]: action.sort } };
    case constants.SET_TABLE_FILTER:
      return { ...state, tableFilter: { ...state.tableFilter, [action.table]: action.filter } };

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
    case constants.SET_TABLE_FILTER:
      return { ...state, ui: uiReducer(state.ui, action) };

    case constants.SET_INCOMPLETE_SCREEN:
      return { ...state, incompleteScreen: action.incompleteScreen };

    case Auth.constants.SIGN_OUT:
      window.location.href = '/';
      return initialState;

    default:
      return state;
  }
}

export default combineReducers({
  app: appReducer,
  auth: Auth.reducers,
  billingCycles: BillingCycles.reducers,
  billings: Billings.reducers,
  comments: Comments.reducers,
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
  reports: Reports.reducers,
  tariffs: Tariffs.reducers,
  users: Users.reducers,
  websiteForms: WebsiteForms.reducers,
});

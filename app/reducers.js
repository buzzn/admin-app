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
  devMode: false,
  incompleteScreen: [],
};

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

    case constants.SET_DEV_MODE:
      return { ...state, devMode: action.mode };

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
});

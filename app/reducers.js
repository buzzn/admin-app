import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';
import Auth from '@buzzn/module_auth';
import config from './config';
import { constants } from './actions';

// in this case initialState includes apiUrl and apiPath, so it will just copy this params into app state.
export function configReducer(state = config) {
  return state;
}

export const initialState = { loading: false, myId: null, profile: {}, friends: [], groups: [] };

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case constants.LOADING:
      return { ...state, loading: true };
    case constants.LOADED:
      return { ...state, loading: false };
    case constants.SET_MY_ID:
      return { ...state, myId: action.myId };
    case constants.SET_USER_ID:
      return { ...state, userId: action.userId };
    case constants.SET_PROFILE:
      return { ...state, profile: action.profile };
    case constants.SET_FRIENDS:
      return { ...state, friends: action.friends };
    case constants.SET_GROUPS:
      return { ...state, groups: action.groups };
    default:
      return state;
  }
}

export default combineReducers({
  // apiUrl and apiPath will be located in 'config' property
  config: configReducer,
  // all data received by redux-json-api will be located in 'api' propery
  api,
  auth: Auth.reducers,
  app: appReducer,
});

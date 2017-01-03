import { combineReducers } from 'redux';
import Auth from '@buzzn/module_auth';
import config from './config';
import { constants } from './actions';

// in this case initialState includes apiUrl and apiPath, so it will just copy this params into app state.
export function configReducer(state = config) {
  return state;
}

export const initialState = {
  loading:     false,

  groups:      [],

  myId:        null,
  userProfile: {},
  userFriends: [],
  userGroups:  []
};

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case constants.LOADING:
      return { ...state, loading: true };
    case constants.LOADED:
      return { ...state, loading: false };

    case constants.SET_GROUPS:
      return { ...state, groups: action.groups };

    case constants.SET_MY_ID:
      return { ...state, myId: action.myId };
    case constants.SET_USER_ID:
      return { ...state, userId: action.userId };
    case constants.SET_USER_PROFILE:
      return { ...state, userProfile: action.userProfile };
    case constants.SET_USER_FRIENDS:
      return { ...state, userFriends: action.userFriends };
    case constants.SET_USER_GROUPS:
      return { ...state, userGroups: action.userGroups };
    default:
      return state;
  }
}

export default combineReducers({
  // apiUrl and apiPath will be located in 'config' property
  config: configReducer,
  auth: Auth.reducers,
  app: appReducer,
});

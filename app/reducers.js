import { combineReducers } from 'redux';
import Auth from '@buzzn/module_auth';
import config from './config';
import { constants } from './actions';
import Profiles from './profiles';
import Groups from './groups';
import Meters from './meters';
import Friends from './friends';

// in this case initialState includes apiUrl and apiPath, so it will just copy this params into app state.
export function configReducer(state = config) {
  return state;
}

export const initialState = {
  loading:     false,
  userMe:      null,
  userFriends: [],
  userMeters:  [],
};

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case constants.LOADING:
      return { ...state, loading: true };
    case constants.LOADED:
      return { ...state, loading: false };
    case constants.SET_USER_ME:
      return { ...state, userMe: action.userMe };
    case constants.SET_USER_ID:
      return { ...state, userId: action.userId };

    case constants.SET_USER_FRIENDS:
      return { ...state, userFriends: action.userFriends };
    case constants.SET_USER_METERS:
      return { ...state, userMeters: action.userMeters };

    default:
      return state;
  }
}

export default combineReducers({
  // apiUrl and apiPath will be located in 'config' property
  config: configReducer,
  auth: Auth.reducers,
  app: appReducer,
  profiles: Profiles.reducers,
  meters: Meters.reducers,
  groups: Groups.reducers,
  friends: Friends.reducers,
});

import { combineReducers } from 'redux';
import Auth from '@buzzn/module_auth';
import config from './config';
import { constants } from './actions';
import Profiles from './profiles';
import Groups from './groups';
import Meters from './meters';
import Friends from './friends';
import Registers from './registers';

// in this case initialState includes apiUrl and apiPath, so it will just copy this params into app state.
export function configReducer(state = config) {
  return state;
}

export const initialState = {
  loading:     false,
  userMe:      null,
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
  registers: Registers.reducers,
});

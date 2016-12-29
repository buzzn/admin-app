import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';
import Auth from '@buzzn/module_auth';
import config from '../config';
import { constants } from '../actions';

import groups from './groupsReducer'

// in this case initialState includes apiUrl and apiPath, so it will just copy this params into app state.
export function configReducer(state = config) {
  return state;
}

export function appReducer(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default combineReducers({
  // apiUrl and apiPath will be located in 'config' property
  config: configReducer,
  // all data received by redux-json-api will be located in 'api' propery
  api,
  groups,
  auth: Auth.reducers,
  app: appReducer,
});

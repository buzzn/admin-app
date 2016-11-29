import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';
import config from './config';
import { constants } from './actions';

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
  config: configReducer,
  api,
  app: appReducer,
});

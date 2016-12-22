import { put, take, select } from 'redux-saga/effects';
import { setEndpointHost, setEndpointPath, setAccessToken } from 'redux-json-api';
import Auth from '@buzzn/module_auth';

export const getConfig = state => state.config;

export default function* appSaga() {
  const { apiUrl, apiPath } = yield select(getConfig);
  // redux-json-api initial configuration
  // to configure it we should dispatch specific redux-json-api actions with needed params
  yield put(setEndpointHost(apiUrl));
  yield put(setEndpointPath(apiPath));
  // end of redux-json-api initial configuration

  while (true) {
    const { token } = yield take(Auth.constants.SIGN_IN);
    if (token) {
      // setting redux-json-api access token
      yield put(setAccessToken(token));
      yield take(Auth.constants.SIGN_OUT);
      yield put(setAccessToken(null));
    }
  }
}

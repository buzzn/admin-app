import { put, take, select } from 'redux-saga/effects';
import { setEndpointHost, setEndpointPath, setAccessToken } from 'redux-json-api';

export const getConfig = state => state.config;

export default function* appSaga() {
  const { apiUrl, apiPath } = yield select(getConfig);
  yield put(setEndpointHost(apiUrl));
  yield put(setEndpointPath(apiPath));
}

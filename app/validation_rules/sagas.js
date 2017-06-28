import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { actions, constants } from './actions';
import api from './api';

export function* validationRulesSagas({ apiUrl, apiPath, token }) {}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);

  while (true) {
    const sagas = yield fork(validationRulesSagas, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

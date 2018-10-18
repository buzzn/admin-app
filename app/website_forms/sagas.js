import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

export function* getWebsiteForms({ apiUrl, apiPath, token }) {
  yield put(actions.loadingWebsiteForms());
  try {
    const websiteForms = yield call(api.fetchWebsiteForms, { apiUrl, apiPath, token });
    yield put(actions.setWebsiteForms(websiteForms));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedWebsiteForms());
}
export function* websiteFormsSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_WEBSITE_FORMS, getWebsiteForms, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(websiteFormsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

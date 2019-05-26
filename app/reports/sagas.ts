import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

const selectReports = state => state.reports;

export function* getEeg({ apiPath, apiUrl, token }, { groupId, params }) {
  yield put(actions.loadingEeg());
  try {
    const eegReport = yield call(api.fetchEegReport, { apiUrl, apiPath, token, groupId, params });
    yield put(actions.setEeg(eegReport));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedEeg());
}

export function* reportsSagas({ apiUrl, apiPath, token }) {
  // @ts-ignore
  yield takeLatest(constants.LOAD_EEG, getEeg, { apiUrl, apiPath, token });

  const { groupId, eegParams } = yield select(selectReports);
  if (groupId && eegParams) yield put(actions.loadEeg({ groupId, params: eegParams }));
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(reportsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

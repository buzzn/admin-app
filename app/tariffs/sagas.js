import { put, call, takeLatest, takeLeading, take, cancel, select, fork } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

export const selectGroup = state => ({ groupId: state.tariffs.groupId });

export function* getTariffs({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingTariffs());
  try {
    const tariffs = yield call(api.fetchTariffs, { apiUrl, apiPath, token, groupId });
    const gapTariffs = yield call(api.fetchGapTariffs, { apiUrl, apiPath, token, groupId });
    yield put(actions.setTariffs({ tariffs, gapTariffs }));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedTariffs());
}

export function* addTariff({ apiUrl, apiPath, token }, { params, resolve, reject, groupId }) {
  try {
    const res = yield call(api.addTariff, { apiUrl, apiPath, token, params, groupId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield call(getTariffs, { apiUrl, apiPath, token }, { groupId });
    }
  } catch (error) {
    logException(error);
  }
}

export function* setGapTariffs({ apiUrl, apiPath, token }, { params, resolve, reject, groupId }) {
  try {
    const res = yield call(api.setGapTariffs, { apiUrl, apiPath, token, params, groupId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield call(getTariffs, { apiUrl, apiPath, token }, { groupId });
    }
  } catch (error) {
    logException(error);
  }
}

export function* tariffsSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_TARIFFS, getTariffs, { apiUrl, apiPath, token });
  yield takeLeading(constants.ADD_TARIFF, addTariff, { apiUrl, apiPath, token });
  yield takeLeading(constants.SET_GAP_TARIFFS, setGapTariffs, { apiUrl, apiPath, token });
  const { groupId } = yield select(selectGroup);
  if (groupId) {
    yield call(getTariffs, { apiUrl, apiPath, token }, { groupId });
  }
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(tariffsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

import { put, call, takeLatest, take, cancel, fork } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException } from '_util';
import Registers from 'registers';
import { constants } from './actions';
import api from './api';

export function* addReading({ apiUrl, apiPath, token }, { meterId, registerId, params, resolve, reject, groupId }) {
  try {
    const res = yield call(api.addReading, { apiUrl, apiPath, token, meterId, registerId, params, groupId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield put(Registers.actions.loadRegister({ registerId, groupId }));
    }
  } catch (error) {
    logException(error);
  }
}

export function* deleteReading({ apiUrl, apiPath, token }, { meterId, registerId, groupId, readingId }) {
  try {
    yield call(api.deleteReading, { apiUrl, apiPath, token, meterId, registerId, groupId, readingId });
    yield put(Registers.actions.loadRegister({ registerId, groupId }));
  } catch (error) {
    logException(error);
  }
}

export function* readingsSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.ADD_READING, addReading, { apiUrl, apiPath, token });
  yield takeLatest(constants.DELETE_READING, deleteReading, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);

  while (true) {
    const sagas = yield fork(readingsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    yield cancel(sagas);
  }
}

import { put, call, takeLatest, takeLeading, take, cancel, fork } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException, convertErrors } from '_util';
import Billings from 'billings';
import Meters from 'meters';
import { constants } from './actions';
import api from './api';

export function* addReading(
  { apiUrl, apiPath, token },
  { meterId, registerId, params, resolve, reject, groupId, billingItem },
) {
  try {
    const res = yield call(api.addReading, { apiUrl, apiPath, token, meterId, registerId, params, groupId });
    if (res._error && res.errors) {
      yield call(reject, new SubmissionError(convertErrors(res.errors)));
      // HACK: dirty hack.
    } else if (billingItem) {
      yield put(
        Billings.actions.attachReading({
          params: {
            ...params,
            [billingItem.begin ? 'beginReadingId' : 'endReadingId']: res.id,
            updatedAt: billingItem.updatedAt,
          },
          resolve,
          reject,
          groupId,
          contractId: billingItem.contractId,
          billingId: billingItem.billingId,
          billingItemId: billingItem.billingItemId,
        }),
      );
    } else {
      yield call(resolve, res);
      yield put(Meters.actions.loadMeter({ groupId, meterId }));
    }
  } catch (error) {
    logException(error);
  }
}

export function* deleteReading({ apiUrl, apiPath, token }, { meterId, registerId, groupId, readingId }) {
  try {
    yield call(api.deleteReading, { apiUrl, apiPath, token, meterId, registerId, groupId, readingId });
    yield put(Meters.actions.loadMeter({ groupId, meterId }));
  } catch (error) {
    logException(error);
  }
}

export function* getAutoReadingValue(
  { apiUrl, apiPath, token },
  { groupId, meterId, registerId, params, resolve, reject },
) {
  try {
    const value = yield call(api.fetchAutoReadingValue, {
      apiUrl,
      apiPath,
      token,
      groupId,
      meterId,
      registerId,
      params,
    });
    resolve(value);
  } catch (error) {
    logException(error);
  }
}

export function* calculateReading(
  { apiUrl, apiPath, token },
  { groupId, contractId, billingId, billingItemId, params, resolve, reject },
) {
  try {
    const value = yield call(api.calculateReading, {
      apiUrl,
      apiPath,
      token,
      groupId,
      contractId,
      billingId,
      billingItemId,
      params,
    });
    resolve(value);
  } catch (error) {
    logException(error);
  }
}

export function* readingsSagas({ apiUrl, apiPath, token }) {
  yield takeLeading(constants.ADD_READING, addReading, { apiUrl, apiPath, token });
  yield takeLeading(constants.DELETE_READING, deleteReading, { apiUrl, apiPath, token });
  yield takeLatest(constants.GET_AUTO_READING_VALUE, getAutoReadingValue, { apiUrl, apiPath, token });
  yield takeLatest(constants.CALCULATE_READING, calculateReading, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(readingsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

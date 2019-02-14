import { put, call, takeLatest, takeLeading, take, fork, cancel, select } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import MarketLocations from 'market_locations';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

export const selectMeterId = state => state.meters.meterId;
export const selectGroupId = state => state.meters.groupId;

export function* getMeter({ apiUrl, apiPath, token }, { meterId, groupId }) {
  yield put(actions.loadingMeter());
  try {
    const meter = yield call(api.fetchMeter, { apiUrl, apiPath, token, meterId, groupId });
    yield put(actions.setMeter(meter));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedMeter());
}

export function* getGroupMeters({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingGroupMeters());
  try {
    const groupMeters = yield call(api.fetchGroupMeters, { apiUrl, apiPath, token, groupId });
    yield put(actions.setGroupMeters(groupMeters));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroupMeters());
}

export function* updateFormulaPart(
  { apiUrl, apiPath, token },
  { meterId, params, resolve, reject, groupId, formulaPartId },
) {
  try {
    const res = yield call(api.updateFormulaPart, { apiUrl, apiPath, token, meterId, params, groupId, formulaPartId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield put(actions.loadGroupMeters(groupId));
      // FIXME: used for the old UI, remove after UI cleanup.
      yield put(actions.loadMeter({ meterId, groupId }));
    }
  } catch (error) {
    logException(error);
  }
}

export function* addRealMeter({ apiUrl, apiPath, token }, { params, resolve, reject, groupId }) {
  try {
    const res = yield call(api.addRealMeter, { apiUrl, apiPath, token, params, groupId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield put(MarketLocations.actions.loadMarketLocations(groupId));
    }
  } catch (error) {
    logException(error);
  }
}

export function* updateMeter({ apiUrl, apiPath, token }, { meterId, params, resolve, reject, groupId }) {
  try {
    const res = yield call(api.updateMeter, { apiUrl, apiPath, token, meterId, params, groupId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield put(actions.loadGroupMeters(groupId));
      yield put(actions.loadMeter({ meterId, groupId }));
    }
  } catch (error) {
    logException(error);
  }
}

export function* metersSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_GROUP_METERS, getGroupMeters, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_METER, getMeter, { apiUrl, apiPath, token });
  yield takeLeading(constants.ADD_REAL_METER, addRealMeter, { apiUrl, apiPath, token });
  yield takeLeading(constants.UPDATE_METER, updateMeter, { apiUrl, apiPath, token });
  yield takeLeading(constants.UPDATE_FORMULA_PART, updateFormulaPart, { apiUrl, apiPath, token });
  const meterId = yield select(selectMeterId);
  const groupId = yield select(selectGroupId);
  if (meterId) yield put(actions.loadMeter({ meterId, groupId }));
  if (groupId) yield put(actions.loadGroupMeters(groupId));
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(metersSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

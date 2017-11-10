// @flow
import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';
import type { MetersState } from './reducers';

type Api = {
  token: string,
  apiUrl: string,
  apiPath: string,
};

export const selectMeterId = (state: { meters: MetersState }): string => state.meters.meterId;
export const selectGroupId = (state: { meters: MetersState }): string => state.meters.groupId;

export function* getMeter({ apiUrl, apiPath, token }: Api, { meterId, groupId }: { meterId: string, groupId: string }): Generator<*, *, *> {
  yield put(actions.loadingMeter());
  try {
    const meter = yield call(api.fetchMeter, { apiUrl, apiPath, token, meterId, groupId });
    yield put(actions.setMeter(meter));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedMeter());
}

export function* getGroupMeters({ apiUrl, apiPath, token }: Api, { groupId }: { groupId: string }): Generator<*, *, *> {
  yield put(actions.loadingGroupMeters());
  try {
    const groupMeters = yield call(api.fetchGroupMeters, { apiUrl, apiPath, token, groupId });
    yield put(actions.setGroupMeters(groupMeters));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroupMeters());
}

export function* updateFormulaPart({ apiUrl, apiPath, token }: Api,
  { meterId, params, resolve, reject, groupId, formulaPartId }:
  { meterId: string, params: Object, resolve: Promise.resolve<*>, reject: Promise.reject<*>, groupId: string, formulaPartId: string }): Generator<*, *, *> {
  try {
    const res = yield call(api.updateFormulaPart, { apiUrl, apiPath, token, meterId, params, groupId, formulaPartId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield call(getGroupMeters, { apiUrl, apiPath, token }, { groupId });
      // FIXME: used for the old UI, remove after UI cleanup.
      yield call(getMeter, { apiUrl, apiPath, token }, { meterId, groupId });
    }
  } catch (error) {
    logException(error);
  }
}

export function* updateMeter({ apiUrl, apiPath, token }: Api,
  { meterId, params, resolve, reject, groupId }:
  { meterId: string, params: Object, resolve: Promise.resolve<*>, reject: Promise.reject<*>, groupId: string }): Generator<*, *, *> {
  try {
    const res = yield call(api.updateMeter, { apiUrl, apiPath, token, meterId, params, groupId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield call(getGroupMeters, { apiUrl, apiPath, token }, { groupId });
      // FIXME: used for the old UI, remove after UI cleanup.
      yield call(getMeter, { apiUrl, apiPath, token }, { meterId, groupId });
    }
  } catch (error) {
    logException(error);
  }
}

export function* metersSagas({ apiUrl, apiPath, token }: Api): Generator<*, *, *> {
  yield takeLatest(constants.LOAD_GROUP_METERS, getGroupMeters, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_METER, getMeter, { apiUrl, apiPath, token });
  yield takeLatest(constants.UPDATE_METER, updateMeter, { apiUrl, apiPath, token });
  yield takeLatest(constants.UPDATE_FORMULA_PART, updateFormulaPart, { apiUrl, apiPath, token });
  const meterId = yield select(selectMeterId);
  const groupId = yield select(selectGroupId);
  if (meterId) yield call(getMeter, { apiUrl, apiPath, token }, { meterId, groupId });
  if (groupId) yield call(getGroupMeters, { apiUrl, apiPath, token }, { groupId });
}

export default function* (): Generator<*, *, *> {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(metersSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

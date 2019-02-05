import { put, call, takeLatest, takeLeading, take, fork, cancel, select } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import Groups from 'groups';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

export const selectBillingCycleId = state => state.billingCycles.billingCycleId;
export const selectGroupId = state => state.billingCycles.groupId;
export const selectBillingId = state => state.billingCycles.billingId;

export function* getBillingCycle({ apiUrl, apiPath, token }, { billingCycleId, groupId }) {
  yield put(actions.loadingBillingCycle());
  try {
    const billingCycle = yield call(api.fetchBillingCycle, { apiUrl, apiPath, token, billingCycleId, groupId });
    const billingCycleBars = yield call(api.fetchbillingCycleBars, {
      apiUrl,
      apiPath,
      token,
      billingCycleId,
      groupId,
    });
    yield put(actions.setBillingCycle({ billingCycle, billingCycleBars }));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedBillingCycle());
}

export function* getBilling({ apiUrl, apiPath, token }, { billingId, groupId, billingCycleId }) {
  yield put(actions.loadingBilling());
  try {
    const billing = yield call(api.fetchBilling, { apiUrl, apiPath, token, billingId, groupId, billingCycleId });
    yield put(actions.setBilling(billing));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedBilling());
}

export function* getBillingCycles({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingBillingCycles());
  try {
    const billingCycles = yield call(api.fetchBillingCycles, { apiUrl, apiPath, token, groupId });
    yield put(actions.setBillingCycles(billingCycles));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedBillingCycles());
}

export function* addBillingCycle({ apiUrl, apiPath, token }, { params, resolve, reject, groupId }) {
  try {
    const res = yield call(api.addBillingCycle, { apiUrl, apiPath, token, params, groupId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield put(Groups.actions.loadGroup(groupId));
      yield put(actions.loadBillingCycles(groupId));
    }
  } catch (error) {
    logException(error);
  }
}

export function* billingCyclesSagas({ apiUrl, apiPath, token }) {
  // @ts-ignore
  yield takeLatest(constants.LOAD_BILLING_CYCLES, getBillingCycles, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLatest(constants.LOAD_BILLING_CYCLE, getBillingCycle, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLeading(constants.ADD_BILLING_CYCLE, addBillingCycle, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLatest(constants.LOAD_BILLING, getBilling, { apiUrl, apiPath, token });

  const billingCycleId = yield select(selectBillingCycleId);
  const groupId = yield select(selectGroupId);
  const billingId = yield select(selectBillingId);
  if (billingCycleId && groupId) yield put(actions.loadBillingCycle({ billingCycleId, groupId }));
  if (billingId && billingCycleId && groupId) {
    yield put(actions.loadBilling({ billingId, groupId, billingCycleId }));
  }
  if (groupId) yield put(actions.loadBillingCycles(groupId));
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(billingCyclesSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

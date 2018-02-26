import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import Groups from 'groups';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

export const selectBillingCycleId = state => state.marketLocations.billingCycleId;
export const selectGroupId = state => state.marketLocations.groupId;

export function* getBillingCycle({ apiUrl, apiPath, token }, { billingCycleId, groupId }) {
  yield put(actions.loadingBillingCycle());
  try {
    const marketLocation = yield call(api.fetchBillingCycle, { apiUrl, apiPath, token, billingCycleId, groupId });
    yield put(actions.setBillingCycle(marketLocation));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedBillingCycle());
}

export function* getBillingCycles({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingBillingCycles());
  try {
    const marketLocations = yield call(api.fetchBillingCycles, { apiUrl, apiPath, token, groupId });
    yield put(actions.setBillingCycles(marketLocations));
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
      yield call(getBillingCycles, { apiUrl, apiPath, token }, { groupId });
    }
  } catch (error) {
    logException(error);
  }
}

export function* billingCyclesSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_BILLING_CYCLES, getBillingCycles, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_BILLING_CYCLE, getBillingCycle, { apiUrl, apiPath, token });
  yield takeLatest(constants.ADD_BILLING_CYCLE, addBillingCycle, { apiUrl, apiPath, token });

  const billingCycleId = yield select(selectBillingCycleId);
  const groupId = yield select(selectGroupId);
  if (billingCycleId) yield call(getBillingCycle, { apiUrl, apiPath, token }, { billingCycleId, groupId });
  if (groupId) yield call(getBillingCycles, { apiUrl, apiPath, token }, { groupId });
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

import saveAs from 'file-saver';
import { channel } from 'redux-saga';
import { put, call, takeLatest, takeLeading, take, fork, cancel, select, race, delay } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import Groups from 'groups';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

export const selectBillingCycleId = state => state.billingCycles.billingCycleId;
export const selectGroupId = state => state.billingCycles.groupId;
export const selectBillingId = state => state.billingCycles.billingId;
export const selectBillingCycle = state => state.billingCycles.billingCycle;
export const selectBillingCycleBars = state => state.billingCycles.billingCycleBars;

export function* getBillingCycle({ apiUrl, apiPath, token, resetChan }, { billingCycleId, groupId }) {
  yield put(resetChan, true);
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

export function* reloadBars({ apiUrl, apiPath, token, resetChan }) {
  while (true) {
    const { reset } = yield race({
      reload: delay(5000),
      reset: take(resetChan),
    });
    if (reset) continue;
    const groupId = yield select(selectGroupId);
    const billingCycle = yield select(selectBillingCycle);
    let billingCycleBars = yield select(selectBillingCycleBars);
    if (!groupId || !billingCycle.id || !billingCycleBars.array.length) continue;
    // const shouldUpdate = !!billingCycleBars.array.find(meta => !!meta.bars.array.find(bar => bar.status === 'queued'));
    // if (!shouldUpdate) continue;
    try {
      billingCycleBars = yield call(api.fetchbillingCycleBars, {
        apiUrl,
        apiPath,
        token,
        billingCycleId: billingCycle.id,
        groupId,
      });
      yield put(actions.setBillingCycle({ billingCycle, billingCycleBars }));
    } catch (error) {
      logException(error);
    }
  }
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
    const gapRes = yield call(api.fillGapContracts, { apiUrl, apiPath, token, params, groupId });
    if (gapRes._error) {
      const errorMessage = Object.keys(gapRes.registerMeta).map(key => gapRes.registerMeta[key].errorMessage).join(' | ');
      yield call(reject, new SubmissionError({ ...gapRes, _error: errorMessage }));
    }
    else {
      const res = yield call(api.addBillingCycle, { apiUrl, apiPath, token, params, groupId });
      if (res._error) {
        const errorMessage = res.createBillings.map( r => r.errors && r.errors.registerMeta ? Object.keys(r.errors.registerMeta).map(key => r.errors.registerMeta[key]).join(' | ') + ` (Contract Number: ${r.contractNumber})` : null).filter(e => !!e).join(' | ');
        yield call(reject, new SubmissionError({ ...res, _error: errorMessage }));
      } 
      else {
        yield call(resolve, res);
        yield put(Groups.actions.loadGroup(groupId));
        yield put(actions.loadBillingCycles(groupId));
      }
    }
  } catch (error) {
    logException(error);
  }

}

export function* getBillingCycleZip({ apiUrl, apiPath, token }, { groupId, billingCycleId, groupName, year }) {
  try {
    const data = yield call(api.fetchbillingCycleZip, { apiUrl, apiPath, token, groupId, billingCycleId });
    // @ts-ignore
    saveAs(data, `Stromrechnung_${year}_${groupName}.zip`);
  } catch (error) {
    logException(error);
  }
}

export function* getBillingCycleReport({ apiUrl, apiPath, token }, { groupId, billingCycleId, groupName, year }) {
  try {
    const data = yield call(api.fetchbillingCycleReport, { apiUrl, apiPath, token, groupId, billingCycleId });
    // @ts-ignore
    saveAs(data, `Report_${year}_${groupName}.xlsx`);
  } catch (error) {
    logException(error);
  }
}

export function* billingCyclesSagas({ apiUrl, apiPath, token }) {
  const resetChan = yield call(channel);
  // @ts-ignore
  yield takeLatest(constants.LOAD_BILLING_CYCLES, getBillingCycles, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLatest(constants.LOAD_BILLING_CYCLE, getBillingCycle, { apiUrl, apiPath, token, resetChan });
  yield fork(reloadBars, { apiUrl, apiPath, token, resetChan });
  // @ts-ignore
  yield takeLeading(constants.GET_BILLING_CYCLE_ZIP, getBillingCycleZip, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLeading(constants.GET_BILLING_CYCLE_REPORT, getBillingCycleReport, { apiUrl, apiPath, token });
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

import saveAs from 'file-saver';
import { put, call, takeLatest, takeLeading, take, fork, cancel, select } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException } from '_util';
import Contracts from 'contracts';
import { actions, constants } from './actions';
import api from './api';

export const selectGroupId = state => state.billings.groupId;
export const selectContractId = state => state.billings.contractId;
export const selectBillingId = state => state.billings.billingId;

export function* getBilling({ apiUrl, apiPath, token }, { billingId, groupId, contractId }) {
  yield put(actions.loadingBilling());
  try {
    const billing = yield call(api.fetchBilling, { apiUrl, apiPath, token, billingId, groupId, contractId });
    yield put(actions.setBilling(billing));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedBilling());
}

export function* getBillings({ apiUrl, apiPath, token }, { groupId, contractId }) {
  yield put(actions.loadingBillings());
  try {
    const billings = yield call(api.fetchBillings, { apiUrl, apiPath, token, groupId, contractId });
    yield put(actions.setBillings(billings));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedBillings());
}

export function* getBillingPDFData(
  { apiUrl, apiPath, token },
  { groupId, contractId, billingId, documentId, fileName },
) {
  try {
    const data = yield call(api.fetchBillingPDFData, {
      apiUrl,
      apiPath,
      token,
      groupId,
      contractId,
      billingId,
      documentId,
    });
    saveAs(data, fileName);
  } catch (error) {
    logException(error);
  }
}

export function* changeBilling(
  { apiUrl, apiPath, token, type },
  { resolve, reject, params, groupId, contractId, ...other },
) {
  const billingsApi = {
    add: api.addBilling,
    update: api.updateBilling,
    attachReading: api.attachReading,
  };

  try {
    const res = yield call(billingsApi[type], { apiUrl, apiPath, token, params, groupId, contractId, ...other });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield call(getBillings, { apiUrl, apiPath, token }, { groupId, contractId });
      // HACK
      yield put(Contracts.actions.loadGroupPowertakers({ groupId, withBillings: true }));
    }
  } catch (error) {
    logException(error);
  }
}

export function* billingsSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_BILLINGS, getBillings, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_BILLING, getBilling, { apiUrl, apiPath, token });
  yield takeLatest(constants.GET_BILLING_PDF_DATA, getBillingPDFData, { apiUrl, apiPath, token });
  yield takeLeading(constants.ADD_BILLING, changeBilling, { apiUrl, apiPath, token, type: 'add' });
  yield takeLeading(constants.UPDATE_BILLING, changeBilling, { apiUrl, apiPath, token, type: 'update' });
  yield takeLeading(constants.ATTACH_READING, changeBilling, { apiUrl, apiPath, token, type: 'attachReading' });

  const billingId = yield select(selectBillingId);
  const contractId = yield select(selectContractId);
  const groupId = yield select(selectGroupId);
  if (billingId && contractId && groupId) yield call(getBilling, { apiUrl, apiPath, token }, { billingId, groupId, contractId });
  if (groupId && contractId) yield call(getBillings, { apiUrl, apiPath, token }, { groupId, contractId });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(billingsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

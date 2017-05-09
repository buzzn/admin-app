import { put, call, takeLatest, take, cancel, select, fork } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import uniqBy from 'lodash/uniqBy';
import upperFirst from 'lodash/upperFirst';
import { constants, actions } from './actions';
import api from './api';

export const selectGroup = state => state.contracts.groupId;
export const selectContract = state => state.contracts.contractId;

export function* getContract({ apiUrl, apiPath, token }, { contractId }) {
  yield put(actions.loadingContract());
  yield put(actions.setContract({ contract: {}, contractor: {}, customer: {} }));
  try {
    const contract = yield call(api.fetchContract, { apiUrl, apiPath, token, contractId });
    // FIXME: change this after https://github.com/buzzn/buzzn/issues/974
    const parties = {};
    const types = ['contractor', 'customer'];
    for (let i = 0; i < types.length; i += 1) {
      parties[types[i]] = yield call(api[`fetch${upperFirst(types[i])}`], { apiUrl, apiPath, token, contractId });
    }
    yield put(actions.setContract({ contract, contractor: parties.contractor, customer: parties.customer }));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedContract());
}

export function* updateBankAccount({ apiUrl, apiPath, token }, { bankAccountId, params, resolve, reject }) {
  try {
    const res = yield call(api.updateBankAccount, { apiUrl, apiPath, token, bankAccountId, params });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      // FIXME: Extract bank/address loading into separate actions and use them after there will be understanding
      // of all use cases for them
      const contractId = yield select(selectContract);
      yield call(getContract, { apiUrl, apiPath, token }, { contractId });
    }
  } catch (error) {
    console.log(error);
  }
}

export function* getGroupContracts({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingGroupContracts());
  yield put(actions.setGroupContracts([]));
  try {
    const operatorContract = yield call(api.fetchOperatorContract, { apiUrl, apiPath, token, groupId });
    const processingContract = yield call(api.fetchProcessingContract, { apiUrl, apiPath, token, groupId });
    yield put(actions.setGroupContracts(uniqBy([operatorContract, processingContract], 'id')));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedGroupContracts());
}

export function* contractSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_GROUP_CONTRACTS, getGroupContracts, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_CONTRACT, getContract, { apiUrl, apiPath, token });
  yield takeLatest(constants.UPDATE_BANK_ACCOUNT, updateBankAccount, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const groupId = yield select(selectGroup);
  const contractId = yield select(selectContract);
  if (groupId) {
    yield call(getGroupContracts, { apiUrl, apiPath, token }, { groupId });
  }
  if (contractId) {
    yield call(getContract, { apiUrl, apiPath, token }, { contractId });
  }

  while (true) {
    const sagas = yield fork(contractSagas, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

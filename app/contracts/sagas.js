import { put, call, takeLatest, take, cancel, select, fork } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import uniqBy from 'lodash/uniqBy';
import { constants, actions } from './actions';
import api from './api';

export const selectGroup = state => state.contracts.groupId;
export const selectContractId = state => state.contracts.contractId;
export const selectContract = state => state.contracts.contract;

export function* getContract({ apiUrl, apiPath, token }, { contractId, groupId }) {
  yield put(actions.loadingContract());
  yield put(actions.setContract({ contract: {}, contractor: {}, customer: {} }));
  try {
    const contract = yield call(api.fetchContract, { apiUrl, apiPath, token, contractId, groupId });
    yield put(actions.setContract({ contract, contractor: contract.contractor, customer: contract.customer }));
  } catch (error) {
    console.error(error);
  }
  yield put(actions.loadedContract());
}

export function* updateBankAccount({ apiUrl, apiPath, token }, { bankAccountId, params, resolve, reject, groupId, partyId, partyType }) {
  try {
    const res = yield call(api.updateBankAccount, { apiUrl, apiPath, token, bankAccountId, params, groupId, partyId, partyType });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      // FIXME: Extract bank/address loading into separate actions and use them after there will be understanding
      // of all use cases for them
      const contractId = yield select(selectContractId);
      yield call(getContract, { apiUrl, apiPath, token }, { contractId, groupId });
    }
  } catch (error) {
    console.error(error);
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
    console.error(error);
  }
  yield put(actions.loadedGroupContracts());
}

export function* getPowertakers({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingGroupPowertakers());
  yield put(actions.setGroupPowertakers([]));
  try {
    const users = yield call(api.fetchGroupPowertakers, { apiUrl, apiPath, token, groupId });
    yield put(actions.setGroupPowertakers(users));
  } catch (error) {
    console.error(error);
  }
  yield put(actions.loadedGroupPowertakers());
}

export function* getPowertaker({ apiUrl, apiPath, token }, { groupId, powertakerId, powertakerType }) {
  yield put(actions.loadingGroupPowertaker());
  yield put(actions.setGroupPowertaker({}));
  try {
    const powertaker = yield call(api.fetchGroupPowertaker, { apiUrl, apiPath, token, groupId, powertakerId, powertakerType });
    yield put(actions.setGroupPowertaker(powertaker));
  } catch (error) {
    console.error(error);
  }
  yield put(actions.loadedGroupPowertaker());
}

export function* contractSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_GROUP_CONTRACTS, getGroupContracts, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_CONTRACT, getContract, { apiUrl, apiPath, token });
  yield takeLatest(constants.UPDATE_BANK_ACCOUNT, updateBankAccount, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_GROUP_POWERTAKERS, getPowertakers, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_GROUP_POWERTAKER, getPowertaker, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const groupId = yield select(selectGroup);
  const contractId = yield select(selectContractId);
  const { powertakerId, powertakerType } = yield select(selectContract);
  if (groupId) {
    yield call(getGroupContracts, { apiUrl, apiPath, token }, { groupId });
    yield call(getPowertakers, { apiUrl, apiPath, token }, { groupId });
    if (contractId) {
      yield call(getContract, { apiUrl, apiPath, token }, { contractId, groupId });
    }
    if (powertakerId && powertakerType) {
      yield call(getPowertaker, { apiUrl, apiPath, token }, { groupId, powertakerType, powertakerId });
    }
  }

  while (true) {
    const sagas = yield fork(contractSagas, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

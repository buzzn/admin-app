import { saveAs } from 'file-saver/FileSaver';
import { put, call, takeLatest, take, cancel, select, fork } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import uniqBy from 'lodash/uniqBy';
import { logException } from '_util';
import { constants, actions } from './actions';
import api from './api';

export const selectGroup = state => state.contracts.groupId;
export const selectContractId = state => state.contracts.contractId;

export function* getContract({ apiUrl, apiPath, token }, { contractId, groupId }) {
  yield put(actions.loadingContract());
  try {
    const contract = yield call(api.fetchContract, { apiUrl, apiPath, token, contractId, groupId });
    yield put(actions.setContract({ contract, contractor: contract.contractor, customer: contract.customer }));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedContract());
}

export function* updateBankAccount(
  { apiUrl, apiPath, token },
  { bankAccountId, params, resolve, reject, groupId, partyId, partyType },
) {
  try {
    const res = yield call(api.updateBankAccount, {
      apiUrl,
      apiPath,
      token,
      bankAccountId,
      params,
      groupId,
      partyId,
      partyType,
    });
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
    logException(error);
  }
}

export function* getGroupContracts({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingGroupContracts());
  try {
    const operatorContract = yield call(api.fetchOperatorContract, { apiUrl, apiPath, token, groupId });
    const processingContract = yield call(api.fetchProcessingContract, { apiUrl, apiPath, token, groupId });
    yield put(actions.setGroupContracts(uniqBy([operatorContract, processingContract], 'id')));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroupContracts());
}

export function* getPowertakers({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingGroupPowertakers());
  try {
    const powertakers = yield call(api.fetchGroupPowertakers, { apiUrl, apiPath, token, groupId });
    yield put(actions.setGroupPowertakers(powertakers));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroupPowertakers());
}

export function* getContractPDFData({ apiUrl, apiPath, token }, { groupId, contractId, documentId, fileName }) {
  try {
    const data = yield call(api.fetchContractPDFData, { apiUrl, apiPath, token, groupId, contractId, documentId });
    saveAs(data, fileName);
  } catch (error) {
    logException(error);
  }
}

export function* attachContractPDF({ apiUrl, apiPath, token }, { params, groupId, contractId, resolve, reject }) {
  try {
    const res = yield call(api.attachContractPDF, { apiUrl, apiPath, token, params, groupId, contractId });
    if (res._status === 200) {
      resolve();
    } else {
      reject(res._status);
    }
  } catch (error) {
    logException(error);
    reject(error);
  }
}

export function* generateContractPDF({ apiUrl, apiPath, token }, { groupId, contractId, resolve, reject }) {
  try {
    const res = yield call(api.generateContractPDF, { apiUrl, apiPath, token, groupId, contractId });
    if (res._status === 200) {
      resolve();
    } else {
      reject(res._status);
    }
  } catch (error) {
    logException(error);
    reject(error);
  }
}

export function* deleteContractPDF({ apiUrl, apiPath, token }, { documentId, groupId, contractId, resolve, reject }) {
  try {
    yield call(api.deleteContractPDF, { apiUrl, apiPath, token, documentId, groupId, contractId });
    resolve();
  } catch (error) {
    logException(error);
    reject(error);
  }
}

export function* contractSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_GROUP_CONTRACTS, getGroupContracts, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_CONTRACT, getContract, { apiUrl, apiPath, token });
  yield takeLatest(constants.UPDATE_BANK_ACCOUNT, updateBankAccount, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_GROUP_POWERTAKERS, getPowertakers, { apiUrl, apiPath, token });
  yield takeLatest(constants.GET_CONTRACT_PDF_DATA, getContractPDFData, { apiUrl, apiPath, token });
  yield takeLatest(constants.ATTACH_CONTRACT_PDF, attachContractPDF, { apiUrl, apiPath, token });
  yield takeLatest(constants.GENERATE_CONTRACT_PDF, generateContractPDF, { apiUrl, apiPath, token });
  yield takeLatest(constants.DELETE_CONTRACT_PDF, deleteContractPDF, { apiUrl, apiPath, token });
  const groupId = yield select(selectGroup);
  const contractId = yield select(selectContractId);
  if (groupId) {
    yield call(getGroupContracts, { apiUrl, apiPath, token }, { groupId });
    yield call(getPowertakers, { apiUrl, apiPath, token }, { groupId });
    if (contractId) {
      yield call(getContract, { apiUrl, apiPath, token }, { contractId, groupId });
    }
  }
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(contractSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

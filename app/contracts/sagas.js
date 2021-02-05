import saveAs from 'file-saver';
import { put, call, takeLatest, take, cancel, select, fork, takeLeading } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException, convertErrors } from '_util';
import Groups from 'groups';
import { constants, actions } from './actions';
import api from './api';

export const selectGroup = state => state.contracts.groupId;
export const selectWithBillings = state => state.contracts.withBillings;
export const selectContractId = state => state.contracts.contractId;

export function* getContract({ apiUrl, apiPath, token }, { contractId, groupId }) {
  yield put(actions.loadingContract());
  try {
    const contract = yield call(api.fetchContract, { apiUrl, apiPath, token, contractId, groupId });
    if (contract.type === 'contract_localpool_power_taker') contract.tariffs = yield call(api.fetchContractTariffs, { apiUrl, apiPath, token, contractId, groupId });
    yield put(actions.setContract({ contract, contractor: contract.contractor, customer: contract.customer }));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedContract());
}

export function* getContractBalanceSheet({ apiUrl, apiPath, token }, { contractId, groupId }) {
  yield put(actions.loadingContractBalanceSheet());
  try {
    const balanceSheet = yield call(api.fetchContractBalanceSheet, { apiUrl, apiPath, token, contractId, groupId });
    yield put(actions.setContractBalanceSheet(balanceSheet));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedContractBalanceSheet());
}

export function* getContractPayments({ apiUrl, apiPath, token }, { contractId, groupId }) {
  yield put(actions.loadingContractPayments());
  try {
    const payments = yield call(api.fetchContractPayments, { apiUrl, apiPath, token, contractId, groupId });
    yield put(actions.setContractPayments(payments));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedContractPayments());
}

export function* attachBankAccount({ apiUrl, apiPath, token }, { params, resolve, reject, groupId, contractId, partyType }) {
  try {
    const res = yield call(api.attachBankAccount, {
      apiUrl,
      apiPath,
      token,
      params,
      groupId,
      contractId,
      partyType,
    });
    if (res._error && res.errors) {
      yield call(reject, new SubmissionError(convertErrors(res.errors)));
    } else {
      yield call(resolve, res);
    }
  } catch (error) {
    logException(error);
  }
}

export function* addBankAccount({ apiUrl, apiPath, token }, { params, resolve, reject, groupId, partyId, partyType }) {
  try {
    const res = yield call(api.addBankAccount, {
      apiUrl,
      apiPath,
      token,
      params,
      groupId,
      partyId,
      partyType,
    });
    if (res._error && res.errors) {
      yield call(reject, new SubmissionError(convertErrors(res.errors)));
    } else {
      yield call(resolve, res);
    }
  } catch (error) {
    logException(error);
  }
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
    if (res._error && res.errors) {
      yield call(reject, new SubmissionError(convertErrors(res.errors)));
    } else {
      yield call(resolve, res);
    }
  } catch (error) {
    logException(error);
  }
}

export function* getGroupContracts({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingGroupContracts());
  try {
    const groupContracts = yield call(api.fetchGroupContracts, { apiUrl, apiPath, token, groupId });
    yield put(actions.setGroupContracts(groupContracts.array));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroupContracts());
}

export function* getPowertakers({ apiUrl, apiPath, token }, { groupId, withBillings }) {
  yield put(actions.loadingGroupPowertakers());
  try {
    const powertakers = yield call(withBillings ? api.fetchGroupPowertakersWithBillings : api.fetchGroupPowertakers, {
      apiUrl,
      apiPath,
      token,
      groupId,
    });
    yield put(actions.setGroupPowertakers(powertakers));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroupPowertakers());
}

export function* addContract({ apiUrl, apiPath, token }, { params, resolve, reject, groupId }) {
  try {
    const res = yield call(api.addContract, { apiUrl, apiPath, token, params, groupId });
    if (res._error && res.errors) {
      yield call(reject, new SubmissionError(convertErrors(res.errors)));
    } else {
      yield call(resolve, res);
      yield put(Groups.actions.loadGroup(groupId));
      yield put(actions.loadGroupContracts(groupId));
      yield put(actions.loadGroupPowertakers({ groupId }));
    }
  } catch (error) {
    logException(error);
  }
}

export function* addPayment({ apiUrl, apiPath, token }, { params, resolve, reject, groupId, contractId }) {
  try {
    const res = yield call(api.addPayment, { apiUrl, apiPath, token, params, groupId, contractId });
    if (res._error && res.errors) {
      yield call(reject, new SubmissionError(convertErrors(res.errors)));
    } else {
      yield call(resolve, res);
      yield put(actions.loadContractPayments({ groupId, contractId }));
    }
  } catch (error) {
    logException(error);
  }
}

export function* updatePayment(
  { apiUrl, apiPath, token },
  { params, resolve, reject, groupId, contractId, paymentId },
) {
  try {
    const res = yield call(api.updatePayment, { apiUrl, apiPath, token, params, groupId, contractId, paymentId });
    if (res._error && res.errors) {
      yield call(reject, new SubmissionError(convertErrors(res.errors)));
    } else {
      yield call(resolve, res);
      yield put(actions.loadContractPayments({ groupId, contractId }));
    }
  } catch (error) {
    logException(error);
  }
}

export function* deletePayment({ apiUrl, apiPath, token }, { groupId, contractId, paymentId }) {
  try {
    const res = yield call(api.deletePayment, { apiUrl, apiPath, token, groupId, contractId, paymentId });
    yield put(actions.loadContractPayments({ groupId, contractId }));
  } catch (error) {
    logException(error);
  }
}

export function* updateContract(
  { apiUrl, apiPath, token },
  { params, resolve, reject, groupId, contractId, updateType },
) {
  console.log('GOT HERE!!!');
  debugger;
  try {
    console.log('UPDATE CONTRACT GENERATOR FUNCTION', { apiUrl, apiPath, token },
    { params, resolve, reject, groupId, contractId, updateType });
    const updateTypes = {
      contract: api.updateContract,
      organizationCustomer: api.updateOrganizationCustomer,
      personCustomer: api.updatePersonCustomer,
      tariffs: api.updateContractTariffs,
      account: api.updateContractAccount,
    };

  
    const res = yield call(updateTypes[updateType], { apiUrl, apiPath, token, params, groupId, contractId });
    if (res._error && res.errors) {
      yield call(reject, new SubmissionError(convertErrors(res.errors)));
    } else {
      yield call(resolve, res);
      yield put(actions.loadContract({ groupId, contractId }));
      if (updateType === 'account') yield put(actions.loadContractBalanceSheet({ groupId, contractId }));
    }
  } catch (error) {
    console.log('EERR==RR', error);
    logException(error);
  }
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

export function* generateContractPDF({ apiUrl, apiPath, token }, { groupId, contractId, resolve, reject, template }) {
  try {
    const res = yield call(api.generateContractPDF, { apiUrl, apiPath, token, groupId, contractId, template });
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
  console.log('contractSagas', constants.UPDATE_CONTRACT, updateContract, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_GROUP_CONTRACTS, getGroupContracts, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_CONTRACT, getContract, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_CONTRACT_BALANCE_SHEET, getContractBalanceSheet, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_CONTRACT_PAYMENTS, getContractPayments, { apiUrl, apiPath, token });
  yield takeLeading(constants.ATTACH_BANK_ACCOUNT, attachBankAccount, { apiUrl, apiPath, token });
  yield takeLeading(constants.ADD_BANK_ACCOUNT, addBankAccount, { apiUrl, apiPath, token });
  yield takeLeading(constants.UPDATE_BANK_ACCOUNT, updateBankAccount, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_GROUP_POWERTAKERS, getPowertakers, { apiUrl, apiPath, token });
  yield takeLeading(constants.ADD_CONTRACT, addContract, { apiUrl, apiPath, token });
  yield takeLeading(constants.UPDATE_CONTRACT, updateContract, { apiUrl, apiPath, token });
  yield takeLeading(constants.ADD_PAYMENT, addPayment, { apiUrl, apiPath, token });
  yield takeLeading(constants.UPDATE_PAYMENT, updatePayment, { apiUrl, apiPath, token });
  yield takeLeading(constants.DELETE_PAYMENT, deletePayment, { apiUrl, apiPath, token });
  yield takeLatest(constants.GET_CONTRACT_PDF_DATA, getContractPDFData, { apiUrl, apiPath, token });
  yield takeLeading(constants.ATTACH_CONTRACT_PDF, attachContractPDF, { apiUrl, apiPath, token });
  yield takeLeading(constants.GENERATE_CONTRACT_PDF, generateContractPDF, { apiUrl, apiPath, token });
  yield takeLeading(constants.DELETE_CONTRACT_PDF, deleteContractPDF, { apiUrl, apiPath, token });
  const groupId = yield select(selectGroup);
  const withBillings = yield select(selectWithBillings);
  const contractId = yield select(selectContractId);
  if (groupId) {
    yield put(actions.loadGroupContracts(groupId));
    yield put(actions.loadGroupPowertakers({ groupId, withBillings }));
    if (contractId) {
      yield put(actions.loadContract({ contractId, groupId }));
      yield put(actions.loadContractBalanceSheet({ contractId, groupId }));
      yield put(actions.loadContractPayments({ contractId, groupId }));
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

import { put, call, takeLatest, take, cancel, select } from 'redux-saga/effects';
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
    const parties = {};
    const types = ['contractor', 'customer'];
    for (let i = 0; i < types.length; i += 1) {
      let p = yield call(api[`fetch${upperFirst(types[i])}`], { apiUrl, apiPath, token, contractId });
      if (p.type === 'organizations') {
        p = yield call(api.fetchOrganization, { apiUrl, apiPath, token, organizationId: p.id });
        p.address = yield call(api.fetchOrganizationAddress, { apiUrl, apiPath, token, organizationId: p.id });
        p.bankAccount = yield call(api.fetchOrganizationBankAccount, { apiUrl, apiPath, token, organizationId: p.id });
      }
      parties[types[i]] = p;
    }
    yield put(actions.setContract({ contract, contractor: parties.contractor, customer: parties.customer }));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedContract());
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
    const groupSagas = yield takeLatest(constants.LOAD_GROUP_CONTRACTS, getGroupContracts, { apiUrl, apiPath, token });
    const contractSagas = yield takeLatest(constants.LOAD_CONTRACT, getContract, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(groupSagas);
    yield cancel(contractSagas);
  }
}

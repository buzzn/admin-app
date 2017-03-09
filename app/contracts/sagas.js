import { put, call, takeLatest, take, cancel, select } from 'redux-saga/effects';
import { constants, actions } from './actions';
import api from './api';

export const selectGroup = state => state.contracts.groupId;

export function* getOperatorContract({ apiUrl, apiPath, token, groupId }) {
  yield put(actions.loadingOperatorContract());
  yield put(actions.setOperatorContract(null));
  try {
    const contract = yield call(api.fetchOperatorContract, { apiUrl, apiPath, token, groupId });
    yield put(actions.setOperatorContract(contract));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedOperatorContract());
}

export function* getProcessingContract({ apiUrl, apiPath, token, groupId }) {
  yield put(actions.loadingProcessingContract());
  yield put(actions.setProcessingContract(null));
  try {
    const contract = yield call(api.fetchProcessingContract, { apiUrl, apiPath, token, groupId });
    yield put(actions.setProcessingContract(contract));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedProcessingContract());
}

export function* getGroupContracts({ apiUrl, apiPath, token }, { groupId }) {
  yield call(getOperatorContract, { apiUrl, apiPath, token, groupId });
  yield call(getProcessingContract, { apiUrl, apiPath, token, groupId });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const groupId = yield select(selectGroup);
  if (groupId) {
    yield call(getGroupContracts, { apiUrl, apiPath, token }, { groupId });
  }

  while (true) {
    const sagas = yield takeLatest(constants.LOAD_GROUP_CONTRACTS, getGroupContracts, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

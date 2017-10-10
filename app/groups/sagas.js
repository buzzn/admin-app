import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';
import Registers from '../registers';

export const selectGroupId = state => state.groups.groupId;

export function* getGroup({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingGroup());
  yield put(actions.setGroup({}));
  try {
    const group = yield call(api.fetchGroup, { apiUrl, apiPath, token, groupId });
    yield put(actions.setGroup(group));
    yield put(Registers.actions.loadRegisters({ groupId }));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroup());
}

export function* getGroups({ apiUrl, apiPath, token }) {
  yield put(actions.loadingGroups());
  yield put(actions.setGroups([]));
  try {
    const groups = yield call(api.fetchGroups, { apiUrl, apiPath, token });
    yield put(actions.setGroups(groups.array));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroups());
}

export function* groupsSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_GROUPS, getGroups, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_GROUP, getGroup, { apiUrl, apiPath, token });
  const groupId = yield select(selectGroupId);
  if (groupId) yield call(getGroup, { apiUrl, apiPath, token }, { groupId });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  yield call(getGroups, { apiUrl, apiPath, token });

  while (true) {
    const sagas = yield fork(groupsSagas, { apiUrl, apiPath, token });
    yield put(actions.endConfig());

    ({ token } = yield take(constants.SET_TOKEN));
    yield put(actions.startConfig());
    yield cancel(sagas);
  }
}

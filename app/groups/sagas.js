import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
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
    console.log(error);
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
    console.log(error);
  }
  yield put(actions.loadedGroups());
}

export function* groupsSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_GROUPS, getGroups, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_GROUP, getGroup, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);

  while (true) {
    const groupId = yield select(selectGroupId);
    yield call(getGroups, { apiUrl, apiPath, token });
    if (groupId) yield call(getGroup, { apiUrl, apiPath, token }, { groupId });

    const sagas = yield fork(groupsSagas, { apiUrl, apiPath, token });
    yield put(actions.endConfig());

    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield put(actions.startConfig());
    yield cancel(sagas);
  }
}

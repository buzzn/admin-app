// @flow
import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';
import Registers from '../registers';

type Api = {
  token: string,
  apiUrl: string,
  apiPath: string,
};

export const selectGroupId = (state: { groups: GroupsState }): string => state.groups.groupId;

export function* getGroup({ apiUrl, apiPath, token }: Api, { groupId }: { groupId: string }): Generator<*, *, *> {
  yield put(actions.loadingGroup());
  try {
    const group = yield call(api.fetchGroup, { apiUrl, apiPath, token, groupId });
    yield put(actions.setGroup(group));
    yield put(Registers.actions.loadRegisters({ groupId }));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroup());
}

export function* getGroups({ apiUrl, apiPath, token }: Api): Generator<*, *, *> {
  yield put(actions.loadingGroups());
  try {
    const { groups, groupsStats } = yield call(api.fetchGroups, { apiUrl, apiPath, token });
    yield put(actions.setGroups(groups));
    yield put(actions.setGroupsStats(groupsStats));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroups());
}

export function* groupsSagas({ apiUrl, apiPath, token }: Api): Generator<*, *, *> {
  yield takeLatest(constants.LOAD_GROUPS, getGroups, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_GROUP, getGroup, { apiUrl, apiPath, token });
  yield call(getGroups, { apiUrl, apiPath, token });
  const groupId = yield select(selectGroupId);
  if (groupId) yield call(getGroup, { apiUrl, apiPath, token }, { groupId });
}

export default function* (): Generator<*, *, *> {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(groupsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

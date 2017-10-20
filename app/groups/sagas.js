// @flow
import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import defaultsDeep from 'lodash/defaultsDeep';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';
import Registers from '../registers';
import type { GroupsState } from './reducers';

export const selectGroupId = (state: { groups: GroupsState }): string => state.groups.groupId;
export const selectStatsTime = (state: { groups: GroupsState }): null | Date => state.groups.lastGroupsStatsReceived;

export function* getGroup({ apiUrl, apiPath, token }: { token: string, apiUrl: string, apiPath: string }, { groupId }: { groupId: string }): Generator<*, *, *> {
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

export function* getGroups({ apiUrl, apiPath, token }: { token: string, apiUrl: string, apiPath: string }): Generator<*, *, *> {
  yield put(actions.loadingGroups());
  yield put(actions.setGroups([]));
  try {
    const groups = yield call(api.fetchGroups, { apiUrl, apiPath, token });
    yield put(actions.setGroups(groups.array));
    const statsTime = yield select(selectStatsTime);
    if (!statsTime || ((new Date()).getTime() - statsTime.getTime()) > 15 * 60 * 1000) {
      const groupIds = groups.array.map(group => group.id);
      const groupsStats = yield call(api.fetchGroupsStats, { apiUrl, apiPath, token, groupIds });
      const groupsTypes = yield call(api.fetchGroupsTypes, { apiUrl, apiPath, token, groupIds });
      yield put(actions.setGroupsStats(defaultsDeep(groupsStats, groupsTypes)));
    }
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroups());
}

export function* groupsSagas({ apiUrl, apiPath, token }: { token: string, apiUrl: string, apiPath: string }): Generator<*, *, *> {
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

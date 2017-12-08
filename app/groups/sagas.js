// @flow
import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';
import type GroupsState from './reducers';

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
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroup());
}

export function* updateGroup({ apiUrl, apiPath, token }: Api,
  { params, resolve, reject, groupId }:
  { params: Object, resolve: Promise.resolve<*>, reject: Promise.reject<*>, groupId: string }): Generator<*, *, *> {
  try {
    const res = yield call(api.updateGroup, { apiUrl, apiPath, token, params, groupId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield call(getGroup, { apiUrl, apiPath, token }, { groupId });
    }
  } catch (error) {
    logException(error);
  }
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
  yield takeLatest(constants.UPDATE_GROUP, updateGroup, { apiUrl, apiPath, token });
  // Put it back when server will be more stable
  // yield call(getGroups, { apiUrl, apiPath, token });
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

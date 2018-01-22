import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

export const getUsersFunctions = {
  groupUsers: {
    loading: actions.loadingGroupUsers,
    set: actions.setGroupUsers,
    fetch: api.fetchGroupUsers,
    loaded: actions.loadedGroupUsers,
  },
  groupManagers: {
    loading: actions.loadingGroupManagers,
    set: actions.setGroupManagers,
    fetch: api.fetchGroupManagers,
    loaded: actions.loadedGroupManagers,
  },
};

export const selectUserId = state => state.users.userId;
export const selectGroupUserId = state => state.users.groupUserId;
export const selectGroupId = state => state.users.groupId;

export function* getUser({ apiUrl, apiPath, token }, { userId }) {
  yield put(actions.loadingUser());
  try {
    const user = yield call(api.fetchUser, { apiUrl, apiPath, token, userId });
    yield put(actions.setUser(user));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedUser());
}

export function* getGroupUser({ apiUrl, apiPath, token }, { userId, groupId }) {
  yield put(actions.loadingGroupUser());
  try {
    const user = yield call(api.fetchGroupUser, { apiUrl, apiPath, token, userId, groupId });
    yield put(actions.setGroupUser(user));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroupUser());
}

export function* getUsers({ apiUrl, apiPath, token, type }, params) {
  yield put(getUsersFunctions[type].loading());
  try {
    const users = yield call(getUsersFunctions[type].fetch, { apiUrl, apiPath, token, ...params });
    yield put(getUsersFunctions[type].set(users));
  } catch (error) {
    logException(error);
  }
  yield put(getUsersFunctions[type].loaded());
}

export function* usersSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_GROUP_USERS, getUsers, { apiUrl, apiPath, token, type: 'users' });
  yield takeLatest(constants.LOAD_GROUP_MANAGERS, getUsers, { apiUrl, apiPath, token, type: 'groupManagers' });
  yield takeLatest(constants.LOAD_USER, getUser, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_GROUP_USER, getGroupUser, { apiUrl, apiPath, token });
  yield takeLatest(constants.SET_USER_ID, getUser, { apiUrl, apiPath, token });

  const userId = yield select(selectUserId);
  if (userId) yield call(getUser, { apiUrl, apiPath, token }, { userId });
  const groupUserId = yield select(selectGroupUserId);
  const groupId = yield select(selectGroupId);
  if (groupId) {
    yield call(getUsers, { apiUrl, apiPath, token, type: 'groupUsers' }, { groupId });
    yield call(getUsers, { apiUrl, apiPath, token, type: 'groupManagers' }, { groupId });
    if (groupUserId) yield call(getGroupUser, { apiUrl, apiPath, token }, { userId, groupId });
  }
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(usersSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

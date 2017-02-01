import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { actions, constants } from './actions';
import api from './api';
import Profiles from '../profiles';
import Friends from '../friends';
import Meters from '../meters';
import Groups from '../groups';

export const getUsersFunctions = {
  users: {
    loading: actions.loadingUsers,
    set: actions.setUsers,
    fetch: api.fetchUsers,
    loaded: actions.loadedUsers,
  },
  groupMembers: {
    loading: actions.loadingGroupMembers,
    set: actions.setGroupMembers,
    fetch: api.fetchGroupMembers,
    loaded: actions.loadedGroupMembers,
  },
  groupManagers: {
    loading: actions.loadingGroupManagers,
    set: actions.setGroupManagers,
    fetch: api.fetchGroupManagers,
    loaded: actions.loadedGroupManagers,
  },
};

export const selectUserId = state => state.users.userId;
export const selectGroupId = state => state.users.groupId;

export function* getUser({ apiUrl, apiPath, token }, { userId }) {
  yield put(actions.loadingUser());
  yield put(actions.setUser(null));
  try {
    const user = yield call(api.fetchUser, { apiUrl, apiPath, token, userId });
    yield put(actions.setUser(user.data));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedUser());
}

export function* getUsers({ apiUrl, apiPath, token, type }, params) {
  yield put(getUsersFunctions[type].loading());
  yield put(getUsersFunctions[type].set([]));
  try {
    const users = yield call(getUsersFunctions[type].fetch, { apiUrl, apiPath, token, ...params });
    for (let i = 0; i < users.length; i += 1) {
      yield put(Profiles.actions.loadProfile(users[i].id));
    }
    yield put(getUsersFunctions[type].set(users));
  } catch (error) {
    console.log(error);
  }
  yield put(getUsersFunctions[type].loaded());
}

export function* getUserInfo({ apiUrl, apiPath, token }, { userId }) {
  yield put(Groups.actions.loadUserGroups(userId));
  yield put(Meters.actions.loadUserMeters(userId));
  yield put(Profiles.actions.loadProfile(userId));
  yield put(Friends.actions.loadFriends(userId));
  yield put(actions.loadUser(userId));
}

export function* usersSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_USERS, getUsers, { apiUrl, apiPath, token, type: 'users' });
  yield takeLatest(constants.LOAD_GROUP_MEMBERS, getUsers, { apiUrl, apiPath, token, type: 'groupMembers' });
  yield takeLatest(constants.LOAD_GROUP_MANAGERS, getUsers, { apiUrl, apiPath, token, type: 'groupManagers' });
  yield takeLatest(constants.LOAD_USER, getUser, { apiUrl, apiPath, token });
  yield takeLatest(constants.SET_USER_ID, getUserInfo, { apiUrl, apiPath, token });

  const userId = yield select(selectUserId);
  const groupId = yield select(selectGroupId);
  yield call(getUsers, { apiUrl, apiPath, token, type: 'users' });
  if (groupId) {
    yield call(getUsers, { apiUrl, apiPath, token, type: 'groupMembers' }, { groupId });
    yield call(getUsers, { apiUrl, apiPath, token, type: 'groupManagers' }, { groupId });
  }
  if (userId) yield call(getUserInfo, { apiUrl, apiPath, token }, { userId });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);

  while (true) {
    const sagas = yield fork(usersSagas, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

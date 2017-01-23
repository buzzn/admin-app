import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { actions, constants } from './actions';
import api from './api';
import Profiles from '../profiles';
import Friends from '../friends';
import Meters from '../meters';
import Groups from '../groups';

export const selectUserId = state => state.users.userId;

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

export function* getUsers({ apiUrl, apiPath, token }) {
  yield put(actions.loadingUsers());
  yield put(actions.setUsers([]));
  try {
    const users = yield call(api.fetchUsers, { apiUrl, apiPath, token });
    for (let i = 0; i < users.length; i += 1) {
      yield put(Profiles.actions.loadProfile(users[i].id));
    }
    yield put(actions.setUsers(users));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedUsers());
}

export function* getUserInfo({ apiUrl, apiPath, token }, { userId }) {
  yield put(Groups.actions.loadUserGroups(userId));
  yield put(Meters.actions.loadUserMeters(userId));
  yield put(Profiles.actions.loadProfile(userId));
  yield put(Friends.actions.loadFriends(userId));
  yield put(actions.loadUser(userId));
}

export function* usersSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_USERS, getUsers, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_USER, getUser, { apiUrl, apiPath, token });
  yield takeLatest(constants.SET_USER_ID, getUserInfo, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const userId = yield select(selectUserId);
  yield call(getUsers, { apiUrl, apiPath, token });
  if (userId) yield call(getUserInfo, { apiUrl, apiPath, token }, { userId });

  while (true) {
    const sagas = yield fork(usersSagas, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

import { put, take, select, call, takeLatest, cancel } from 'redux-saga/effects';
import Auth from '@buzzn/module_auth';
import { constants, actions } from '../actions';
import api from '../api';

export const getConfig = state => state.config;

export function* getUserMe({ apiUrl, apiPath, token }) {
  try {
    const { userMe } = yield call(api.getUserMe, { apiUrl, apiPath, token });
    yield put(actions.setUserMe(userMe));
    yield put(actions.setUserId(userMe));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function* getUserProfile({ apiUrl, apiPath, token, userId }) {
  try {
    const userProfile = yield call(api.getUserProfile, { apiUrl, apiPath, token, userId });
    yield put(actions.setUserProfile(userProfile));
  } catch (error) {
    console.log(error);
  }
}

export function* getUserFriends({ apiUrl, apiPath, token, userId }) {
  yield put(actions.setUserFriends([]));
  try {
    const userFriendsIds = yield call(api.getUserFriends, { apiUrl, apiPath, token, userId });
    const userFriends = [];
    // TODO: this can be moved to api
    for (let i = 0; i < userFriendsIds.length; i += 1) {
      const id = userFriendsIds[i].id;
      const profile = yield call(api.getUserProfile, { apiUrl, apiPath, token, userId: id })
      userFriends.push({ id, profile: profile });
    }
    yield put(actions.setUserFriends(userFriends));
  } catch (error) {
    console.log(error);
  }
}

export function* getUserGroups({ apiUrl, apiPath, token, userId }) {
  yield put(actions.setUserGroups([]));
  try {
    const userGroups = yield call(api.getUserGroups, { apiUrl, apiPath, token, userId });
    yield put(actions.setUserGroups(userGroups));
  } catch (error) {
    console.log(error);
  }
}



export function* getUserInfo({ apiUrl, apiPath, token }, { userId }) {
  yield call(getUserProfile, { apiUrl, apiPath, token, userId });
  yield call(getUserFriends, { apiUrl, apiPath, token, userId });
  yield call(getUserGroups,  { apiUrl, apiPath, token, userId });
}



export default function* profile() {
  const { apiUrl, apiPath } = yield select(getConfig);

  while (true) {
    const { token } = yield take(Auth.constants.SIGN_IN);
    if (token) {
      const userInfoSaga = yield takeLatest(constants.SET_USER_ID, getUserInfo, { apiUrl, apiPath, token });
      if (yield call(getUserMe, { apiUrl, apiPath, token })) {
        yield take(Auth.constants.SIGN_OUT);
      } else {
        yield put(Auth.actions.signOut());
      }
      yield cancel(userInfoSaga);
      // TODO: clean up state
    }
  }
}

import { put, take, select, call, takeLatest, cancel } from 'redux-saga/effects';
import Auth from '@buzzn/module_auth';
import { constants, actions } from '../actions';
import api from '../api';

import Groups from '../groups';
import Meters from '../meters';
import Profiles from '../profiles';
import Friends from '../friends';

export const getConfig = state => state.config;

export function* getUserMe({ apiUrl, apiPath, token }) {
  try {
    const { userMe } = yield call(api.fetchUserMe, { apiUrl, apiPath, token });
    yield put(actions.setUserMe(userMe));
    yield put(actions.setUserId(userMe));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function* getUserInfo({ apiUrl, apiPath, token }, { userId }) {
  yield put(Groups.actions.loadUserGroups(userId));
  yield put(Meters.actions.loadUserMeters(userId));
  yield put(Profiles.actions.loadProfile(userId));
  yield put(Friends.actions.loadFriends(userId));
}

export default function* () {
  const { apiUrl, apiPath } = yield select(getConfig);
  yield put(Groups.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Meters.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Profiles.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Friends.actions.setApiParams({ apiUrl, apiPath }));

  while (true) {
    const { token } = yield take(Auth.constants.SIGN_IN);
    if (token) {
      yield put(Groups.actions.setToken(token));
      yield put(Meters.actions.setToken(token));
      yield put(Profiles.actions.setToken(token));
      yield put(Friends.actions.setToken(token));

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

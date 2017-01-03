import { put, take, select, call, takeLatest, cancel } from 'redux-saga/effects';
import Auth from '@buzzn/module_auth';
import { constants, actions } from '../actions';
import api from '../api';
import getUserProfile from './profile';
import getUserFriends from './friends';
import getUserGroups from './groups';

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
  yield call(getUserProfile, { apiUrl, apiPath, token, userId });
  yield call(getUserFriends, { apiUrl, apiPath, token, userId });
  yield call(getUserGroups, { apiUrl, apiPath, token, userId });
}

export default function* () {
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

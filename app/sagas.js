import { put, take, select, call, takeLatest, cancel } from 'redux-saga/effects';
import { setEndpointHost, setEndpointPath, setAccessToken } from 'redux-json-api';
import Auth from '@buzzn/module_auth';
import { constants, actions } from './actions';
import api from './api';

export const getConfig = state => state.config;

export function* getMyId({ apiUrl, apiPath, token }) {
  try {
    const { myId } = yield call(api.getMyId, { apiUrl, apiPath, token });
    yield put(actions.setMyId(myId));
    yield put(actions.setUserId(myId));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function* getProfile({ apiUrl, apiPath, token, userId }) {
  try {
    const profile = yield call(api.getProfile, { apiUrl, apiPath, token, userId });
    yield put(actions.setProfile(profile));
  } catch (error) {
    console.log(error);
  }
}

export function* getFriends({ apiUrl, apiPath, token, userId }) {
  try {
    const friendIds = yield call(api.getFriends, { apiUrl, apiPath, token, userId });
    const friends = [];
    for (let i = 0; i < friendIds.length; i += 1) {
      const id = friendIds[i].id;
      friends.push({ id, profile: yield call(api.getProfile, { apiUrl, apiPath, token, userId: id }) });
    }
    yield put(actions.setFriends(friends));
  } catch (error) {
    console.log(error);
  }
}

export function* getUserInfo({ apiUrl, apiPath, token }, { userId }) {
  yield call(getProfile, { apiUrl, apiPath, token, userId });
  yield call(getFriends, { apiUrl, apiPath, token, userId });
}

export default function* appSaga() {
  const { apiUrl, apiPath } = yield select(getConfig);
  // redux-json-api initial configuration
  // to configure it we should dispatch specific redux-json-api actions with needed params
  yield put(setEndpointHost(apiUrl));
  yield put(setEndpointPath(apiPath));
  // end of redux-json-api initial configuration

  while (true) {
    const { token } = yield take(Auth.constants.SIGN_IN);
    if (token) {
      // setting redux-json-api access token
      yield put(setAccessToken(token));

      const userInfoSaga = yield takeLatest(constants.SET_USER_ID, getUserInfo, { apiUrl, apiPath, token });
      if (yield call(getMyId, { apiUrl, apiPath, token })) {
        yield take(Auth.constants.SIGN_OUT);
      } else {
        yield put(Auth.actions.signOut());
      }
      yield put(setAccessToken(null));
      yield cancel(userInfoSaga);
      // TODO: clean up state
    }
  }
}

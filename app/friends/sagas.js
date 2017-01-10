import { put, call, takeLatest, take, cancel, select } from 'redux-saga/effects';
import Profile from '../profiles';
import { actions, constants } from './actions';
import api from './api';

export const selectUserId = state => state.friends.userId;

export function* getFriends({ apiUrl, apiPath, token }, { userId }) {
  yield put(actions.loadingFriends());
  yield put(actions.setFriends([]));
  try {
    const friends = yield call(api.fetchUserFriends, { apiUrl, apiPath, token, userId });
    for (let i = 0; i < friends.length; i += 1) {
      yield put(Profile.actions.loadProfile(friends[i].id));
    }
    yield put(actions.setFriends(friends));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedFriends());
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const userId = yield select(selectUserId);
  if (userId) yield call(getFriends, { apiUrl, apiPath, token }, { userId });

  while (true) {
    const sagas = yield takeLatest(constants.LOAD_FRIENDS, getFriends, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

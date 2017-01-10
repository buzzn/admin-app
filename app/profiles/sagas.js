import { put, call, takeEvery, take, cancel } from 'redux-saga/effects';
import { actions, constants } from './actions';
import api from './api';

export function* getProfile({ apiUrl, apiPath, token }, { userId }) {
  yield put(actions.loadingProfile(userId));
  try {
    const profile = yield call(api.fetchProfile, { apiUrl, apiPath, token, userId });
    yield put(actions.setProfile({ userId, profile }));
  } catch (error) {
    console.log(error);
    yield put(actions.failedProfile(userId));
  }
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);

  while (true) {
    const sagas = yield takeEvery(constants.LOAD_PROFILE, getProfile, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

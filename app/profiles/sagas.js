import { put, call, takeLatest, take, cancel } from 'redux-saga/effects';
import { actions, constants } from './actions';
import api from './api';

export function* getProfile({ apiUrl, apiPath, token }, { userId }) {
  yield put(actions.loadingProfile());
  yield put(actions.setProfile({ userId, profile: null }));
  try {
    const profile = yield call(api.fetchProfile, { apiUrl, apiPath, token, userId });
    yield put(actions.setProfile({ userId, profile }));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedProfile());
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);

  while (true) {
    const sagas = yield takeLatest(constants.LOAD_PROFILE, getProfile, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

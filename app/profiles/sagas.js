import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { actions, constants } from './actions';
import api from './api';

export const selectProfileId = state => state.profiles.profileId;

export function* getProfile({ apiUrl, apiPath, token }, { profileId }) {
  yield put(actions.loadingProfile());
  yield put(actions.setProfile(null));
  try {
    const profile = yield call(api.fetchProfile, { apiUrl, apiPath, token, profileId });
    yield put(actions.setProfile(profile.data));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedProfile());
}

export function* getProfiles({ apiUrl, apiPath, token }) {
  yield put(actions.loadingProfiles());
  yield put(actions.setProfiles([]));
  try {
    const profiles = yield call(api.fetchProfiles, { apiUrl, apiPath, token });
    yield put(actions.setProfiles(profiles));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedProfiles());
}

export function* getUserProfiles({ apiUrl, apiPath, token }, { userId }) {
  yield put(actions.loadingUserProfiles());
  yield put(actions.setUserProfiles([]));
  try {
    const userProfiles = yield call(api.fetchUserProfiles, { apiUrl, apiPath, token, userId });
    yield put(actions.setUserProfiles(userProfiles));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedUserProfiles());
}

export function* profilesSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_PROFILES, getProfiles, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_PROFILE, getProfile, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const profileId = yield select(selectProfileId);
  yield call(getProfiles, { apiUrl, apiPath, token });
  if (profileId) yield call(getProfile, { apiUrl, apiPath, token }, { profileId });

  while (true) {
    const sagas = yield fork(profilesSagas, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

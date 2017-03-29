import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { actions, constants } from './actions';
import api from './api';

export const selectMeterId = state => state.meters.meterId;
export const selectGroupId = state => state.meters.groupId;

export function* getMeter({ apiUrl, apiPath, token }, { meterId }) {
  yield put(actions.loadingMeter());
  yield put(actions.setMeter({}));
  try {
    const meter = yield call(api.fetchMeter, { apiUrl, apiPath, token, meterId });
    yield put(actions.setMeter(meter));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedMeter());
}

export function* getGroupMeters({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingGroupMeters());
  yield put(actions.setGroupMeters([]));
  try {
    const groupMeters = yield call(api.fetchGroupMeters, { apiUrl, apiPath, token, groupId });
    yield put(actions.setGroupMeters(groupMeters));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedGroupMeters());
}

export function* getUserMeters({ apiUrl, apiPath, token }, { userId }) {
  yield put(actions.loadingUserMeters());
  yield put(actions.setUserMeters([]));
  try {
    const userMeters = yield call(api.fetchUserMeters, { apiUrl, apiPath, token, userId });
    yield put(actions.setUserMeters(userMeters));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedUserMeters());
}

export function* metersSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_GROUP_METERS, getGroupMeters, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_USER_METERS, getUserMeters, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_METER, getMeter, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const meterId = yield select(selectMeterId);
  const groupId = yield select(selectGroupId);
  if (meterId) yield call(getMeter, { apiUrl, apiPath, token }, { meterId });
  if (groupId) yield call(getGroupMeters, { apiUrl, apiPath, token }, { groupId });

  while (true) {
    const sagas = yield fork(metersSagas, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

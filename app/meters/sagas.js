import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { actions, constants } from './actions';
import api from './api';

export const selectMeterId = state => state.meters.meterId;

export function* getMeter({ apiUrl, apiPath, token }, { meterId }) {
  yield put(actions.loadingMeter());
  yield put(actions.setMeter(null));
  try {
    const meter = yield call(api.fetchMeter, { apiUrl, apiPath, token, meterId });
    yield put(actions.setMeter(meter.data));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedMeter());
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
  yield takeLatest(constants.LOAD_METERS, getMeters, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_METER, getMeter, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const meterId = yield select(selectMeterId);
  yield call(getMeters, { apiUrl, apiPath, token });
  if (meterId) yield call(getMeter, { apiUrl, apiPath, token }, { meterId });

  while (true) {
    const sagas = yield fork(metersSagas, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

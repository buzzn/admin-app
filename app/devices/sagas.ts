import { put, call, takeLatest, takeLeading, take, fork, cancel, select } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

export const selectDeviceId = state => state.devices.deviceId;
export const selectGroupId = state => state.devices.groupId;

export function* getDevice({ apiUrl, apiPath, token }, { deviceId, groupId }) {
  yield put(actions.loadingDevice());
  try {
    const device = yield call(api.fetchDevice, { apiUrl, apiPath, token, deviceId, groupId });
    yield put(actions.setDevice({ device }));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedDevice());
}

export function* getDevices({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingDevices());
  try {
    const devices = yield call(api.fetchDevices, { apiUrl, apiPath, token, groupId });
    yield put(actions.setDevices(devices));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedDevices());
}

export function* addDevice({ apiUrl, apiPath, token }, { params, resolve, reject, groupId }) {
  try {
    const res = yield call(api.addDevice, { apiUrl, apiPath, token, params, groupId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield call(getDevices, { apiUrl, apiPath, token }, { groupId });
    }
  } catch (error) {
    logException(error);
  }
}

export function* updateDevice({ apiUrl, apiPath, token }, { params, resolve, reject, groupId, deviceId }) {
  try {
    const res = yield call(api.updateDevice, { apiUrl, apiPath, token, params, groupId, deviceId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield call(getDevice, { apiUrl, apiPath, token }, { groupId, deviceId });
      yield call(getDevices, { apiUrl, apiPath, token }, { groupId });
    }
  } catch (error) {
    logException(error);
  }
}

export function* deleteDevice({ apiUrl, apiPath, token }, { groupId, deviceId }) {
  try {
    yield call(api.deleteDevice, { apiUrl, apiPath, token, groupId, deviceId });
    yield call(getDevices, { apiUrl, apiPath, token }, { groupId });
  } catch (error) {
    logException(error);
  }
}

export function* devicesSagas({ apiUrl, apiPath, token }) {
  // @ts-ignore
  yield takeLatest(constants.LOAD_DEVICES, getDevices, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLatest(constants.LOAD_DEVICE, getDevice, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLeading(constants.ADD_DEVICE, addDevice, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLeading(constants.UPDATE_DEVICE, updateDevice, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLeading(constants.DELETE_DEVICE, deleteDevice, { apiUrl, apiPath, token });

  const deviceId = yield select(selectDeviceId);
  const groupId = yield select(selectGroupId);
  if (deviceId) yield call(getDevice, { apiUrl, apiPath, token }, { deviceId, groupId });
  if (groupId) yield call(getDevices, { apiUrl, apiPath, token }, { groupId });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(devicesSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

import { put, call, takeLatest, take, cancel, select, fork } from 'redux-saga/effects';
import { actions, constants } from './actions';
import api from './api';

export const selectMeter = state => ({ meterId: state.registers.meterId, meterType: state.registers.meterType });
export const selectGroup = state => ({ groupId: state.registers.groupId });
export const selectRegister = state => ({ registerId: state.registers.registerId });

export function* getRegister({ apiUrl, apiPath, token }, { registerId }) {
  yield put(actions.loadingRegister());
  yield put(actions.setRegister({ register: {}, readings: [] }));
  try {
    const register = yield call(api.fetchRegister, { apiUrl, apiPath, token, registerId });
    const readings = yield call(api.fetchRegisterReadings, { apiUrl, apiPath, token, registerId });
    yield put(actions.setRegister({ register, readings }));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedRegister());
}

// TODO: if there will be another load case for registers, then it'll be better to separate actions/reducers
// current implementation is incompatible with cache
export function* getRegisters({ apiUrl, apiPath, token }, { meterId, meterType, groupId }) {
  yield put(actions.loadingRegisters());
  yield put(actions.setRegisters([]));
  try {
    let registers = [];
    if (groupId) {
      registers = yield call(api.fetchGroupRegisters, { apiUrl, apiPath, token, groupId });
    } else {
      registers = yield call(api.fetchMeterRegisters, { apiUrl, apiPath, token, meterId, meterType });
    }
    yield put(actions.setRegisters(registers));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedRegisters());
}

export function* registersSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_REGISTERS, getRegisters, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_REGISTER, getRegister, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const { meterId, meterType } = yield select(selectMeter);
  const { groupId } = yield select(selectGroup);
  const { registerId } = yield select(selectRegister);
  if ((meterId && meterType) || groupId) {
    yield call(getRegisters, { apiUrl, apiPath, token }, { meterId, meterType, groupId });
  }
  if (registerId) yield call(getRegister, { apiUrl, apiPath, token }, { registerId });

  while (true) {
    const sagas = yield fork(registersSagas, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

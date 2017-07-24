import { put, call, takeLatest, take, cancel, select, fork } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { actions, constants } from './actions';
import api from './api';

export const selectGroup = state => ({ groupId: state.registers.groupId });
export const selectRegister = state => ({ registerId: state.registers.registerId });

export function* getRegister({ apiUrl, apiPath, token }, { registerId, groupId }) {
  yield put(actions.loadingRegister());
  yield put(actions.setRegister({ register: {}, readings: [] }));
  try {
    const register = yield call(api.fetchRegister, { apiUrl, apiPath, token, registerId, groupId });
    const readings = yield call(api.fetchRegisterReadings, { apiUrl, apiPath, token, registerId, groupId });
    yield put(actions.setRegister({ register, readings: readings.array }));
  } catch (error) {
    console.error(error);
  }
  yield put(actions.loadedRegister());
}

export function* updateRegister({ apiUrl, apiPath, token }, { registerId, params, resolve, reject, groupId }) {
  try {
    const res = yield call(api.updateRegister, { apiUrl, apiPath, token, registerId, params, groupId });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield call(getRegister, { apiUrl, apiPath, token }, { registerId, groupId });
    }
  } catch (error) {
    console.error(error);
  }
}

// TODO: if there will be another load case for registers, then it'll be better to separate actions/reducers
// current implementation is incompatible with cache
export function* getRegisters({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingRegisters());
  yield put(actions.setRegisters([]));
  try {
    let registers = [];
    registers = yield call(api.fetchGroupRegisters, { apiUrl, apiPath, token, groupId });
    yield put(actions.setRegisters(registers.array));
  } catch (error) {
    console.error(error);
  }
  yield put(actions.loadedRegisters());
}

export function* registersSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_REGISTERS, getRegisters, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_REGISTER, getRegister, { apiUrl, apiPath, token });
  yield takeLatest(constants.UPDATE_REGISTER, updateRegister, { apiUrl, apiPath, token });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const { groupId } = yield select(selectGroup);
  const { registerId } = yield select(selectRegister);
  if (groupId) {
    yield call(getRegisters, { apiUrl, apiPath, token }, { groupId });
    if (registerId) yield call(getRegister, { apiUrl, apiPath, token }, { registerId, groupId });
  }

  while (true) {
    const sagas = yield fork(registersSagas, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

import { put, call, takeLatest, take, cancel, select } from 'redux-saga/effects';
import { actions, constants } from './actions';
import api from './api';

export const selectMeter = state => ({ meterId: state.registers.meterId, meterType: state.registers.meterType });

export function* getRegisters({ apiUrl, apiPath, token }, { meterId, meterType }) {
  yield put(actions.loadingRegisters());
  yield put(actions.setRegisters([]));
  try {
    const registers = yield call(api.fetchMeterRegisters, { apiUrl, apiPath, token, meterId, meterType });
    yield put(actions.setRegisters(registers));
  } catch (error) {
    console.log(error);
  }
  yield put(actions.loadedRegisters());
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const { meterId, meterType } = yield select(selectMeter);
  if (meterId && meterType) yield call(getRegisters, { apiUrl, apiPath, token }, { meterId, meterType });

  while (true) {
    const sagas = yield takeLatest(constants.LOAD_REGISTERS, getRegisters, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

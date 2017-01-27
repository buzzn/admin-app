import { put, call, takeLatest, take, cancel, select } from 'redux-saga/effects';
import { actions, constants } from './actions';
import api from './api';

export const selectMeter = state => ({ meterId: state.registers.meterId, meterType: state.registers.meterType });
export const selectGroup = state => ({ groupId: state.registers.groupId });

// TODO: if there will be another load case for registes, then it'll be better to separate actions/reducers
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

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  const { meterId, meterType } = yield select(selectMeter);
  const { groupId } = yield select(selectGroup);
  if ((meterId && meterType) || groupId) {
    yield call(getRegisters, { apiUrl, apiPath, token }, { meterId, meterType, groupId });
  }

  while (true) {
    const sagas = yield takeLatest(constants.LOAD_REGISTERS, getRegisters, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

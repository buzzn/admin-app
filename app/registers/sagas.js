import { put, call, takeLatest, takeLeading, take, cancel, select, fork } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException } from '_util';
import MarketLocations from 'market_locations';
import { actions, constants } from './actions';
import api from './api';

export const selectGroup = state => ({ groupId: state.registers.groupId });
export const selectRegister = state => ({ registerId: state.registers.registerId, meterId: state.registers.meterId });

export function* getRegister({ apiUrl, apiPath, token }, { registerId, groupId, meterId }) {
  yield put(actions.loadingRegister());
  try {
    const register = yield call(api.fetchRegister, { apiUrl, apiPath, token, registerId, groupId, meterId });
    yield put(actions.setRegister(register));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedRegister());
}

export function* getRegisterPower({ apiUrl, apiPath, token }, { registerId, groupId, meterId }) {
  try {
    const power = yield call(api.fetchRegisterPower, { apiUrl, apiPath, token, registerId, groupId, meterId });
    yield put(actions.setRegisterPower({ power }));
  } catch (error) {
    logException(error);
  }
}

export function* updateRegister({ apiUrl, apiPath, token }, { registerId, params, resolve, reject, groupId }) {
  try {
    const res = yield call(api.updateRegister, { apiUrl, apiPath, token, registerId, params, groupId });
    if (res._error) {
      if (res.observer) {
        res.observerMinThreshold = res.observer;
        res.observerMaxThreshold = res.observer;
        delete res.observer;
      }
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield put(MarketLocations.actions.loadMarketLocations(groupId));
    }
  } catch (error) {
    logException(error);
  }
}

export function* registersSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_REGISTER, getRegister, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_REGISTER_POWER, getRegisterPower, { apiUrl, apiPath, token });
  yield takeLeading(constants.UPDATE_REGISTER, updateRegister, { apiUrl, apiPath, token });
  const { groupId } = yield select(selectGroup);
  const { registerId, meterId } = yield select(selectRegister);
  if (groupId) {
    if (registerId && meterId) {
      yield call(getRegister, { apiUrl, apiPath, token }, { registerId, groupId, meterId });
      yield call(getRegisterPower, { apiUrl, apiPath, token }, { registerId, groupId, meterId });
    }
  }
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(registersSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

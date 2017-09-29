import { put, take, select, call, takeLatest } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import Auth from '@buzzn/module_auth';
import Bubbles from '@buzzn/module_bubbles';
import Charts from '@buzzn/module_charts';
import { logException } from '_util';
import { actions, constants } from 'actions';
import api from 'api';

import Groups from 'groups';
import Meters from 'meters';
import Registers from 'registers';
import Users from 'users';
import Contracts from 'contracts';
import Readings from 'readings';
import ValidationRules from 'validation_rules';

import loadingList, { authList } from 'validation_rules_list';

export const getConfig = state => state.config;

export function* getUserMe({ apiUrl, apiPath, token }) {
  try {
    const userMe = yield call(api.fetchUserMe, { apiUrl, apiPath, token });
    yield put(actions.setUserMe(userMe));
    return true;
  } catch (error) {
    logException(error);
    return false;
  }
}

export function* updateUserMe({ apiUrl, apiPath, token }, { params, resolve, reject }) {
  try {
    const res = yield call(api.updateUserMe, { apiUrl, apiPath, token, params });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield call(getUserMe, { apiUrl, apiPath, token });
    }
  } catch (error) {
    logException(error);
  }
}

export default function* () {
  const { apiUrl, apiPath, authPath, secure } = yield select(getConfig);

  if (secure && window.location.protocol !== 'https:') {
    window.location.href = `https:${window.location.href.substring(window.location.protocol.length)}`;
  }

  yield put(Bubbles.actions.setApiParams({ apiUrl, apiPath: `${apiPath}/localpools` }));
  yield put(Charts.actions.setApiParams({ apiUrl, apiPath: `${apiPath}/localpools` }));
  yield put(Groups.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Meters.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Registers.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Users.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Contracts.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Readings.actions.setApiParams({ apiUrl, apiPath }));
  yield put(ValidationRules.actions.setApiParams({ apiUrl, apiPath }));

  while (true) {
    const { token } = yield take(Auth.constants.SIGN_IN);
    if (token) {
      yield put(Bubbles.actions.setToken(token));
      yield put(Charts.actions.setToken(token));
      yield put(Groups.actions.setToken(token));
      yield put(Meters.actions.setToken(token));
      yield put(Registers.actions.setToken(token));
      yield put(Users.actions.setToken(token));
      yield put(Contracts.actions.setToken(token));
      yield put(Readings.actions.setToken(token));
      yield put(ValidationRules.actions.setToken(token));

      yield put(ValidationRules.actions.setLoadingList({ loadingList }));
      yield put(ValidationRules.actions.setLoadingList({ loadingList: authList, pathOverride: authPath }));

      if (yield call(getUserMe, { apiUrl, apiPath, token })) {
        yield takeLatest(constants.LOAD_USER_ME, getUserMe, { apiUrl, apiPath, token });
        yield takeLatest(constants.UPDATE_USER_ME, updateUserMe, { apiUrl, apiPath, token });
        yield take(Auth.constants.SIGN_OUT);
      } else {
        yield put(Auth.actions.signOut());
      }
      // TODO: clean up state
    }
  }
}

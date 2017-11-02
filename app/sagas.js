import { put, take, select, call, takeLatest, fork } from 'redux-saga/effects';
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
export const getAuth = state => state.auth;

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

export function* switchUI(payload) {
  yield call(api.setUIVer, payload.uiVer);
}

export function* setToken(token) {
  yield put(Bubbles.actions.setToken(token));
  yield put(Charts.actions.setToken(token));
  yield put(Groups.actions.setToken(token));
  yield put(Meters.actions.setToken(token));
  yield put(Registers.actions.setToken(token));
  yield put(Users.actions.setToken(token));
  yield put(Contracts.actions.setToken(token));
  yield put(Readings.actions.setToken(token));
  yield put(ValidationRules.actions.setToken(token));
}

export function* setHealth({ apiUrl }) {
  try {
    const health = yield call(api.fetchHealth, { apiUrl });
    yield put(actions.setHealth(health));
  } catch (error) {
    logException(error);
  }
}

export default function* () {
  const uiVer = yield call(api.getUIVer);
  yield put(actions.switchUI(uiVer));
  yield takeLatest(constants.SWITCH_UI, switchUI);

  const { apiUrl, apiPath, authPath, secure } = yield select(getConfig);

  if (secure && window.location.protocol !== 'https:') {
    window.location.href = `https:${window.location.href.substring(window.location.protocol.length)}`;
  }

  yield put(Auth.actions.setApiParams({ apiUrl, apiPath: authPath }));
  yield put(Bubbles.actions.setApiParams({ apiUrl, apiPath: `${apiPath}/localpools` }));
  yield put(Charts.actions.setApiParams({ apiUrl, apiPath: `${apiPath}/localpools` }));
  yield put(Groups.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Meters.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Registers.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Users.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Contracts.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Readings.actions.setApiParams({ apiUrl, apiPath }));
  yield put(ValidationRules.actions.setApiParams({ apiUrl, apiPath }));

  let { token } = yield select(getAuth);

  while (true) {
    yield fork(setHealth, { apiUrl });

    if (!token) {
      ({ token } = yield take(Auth.constants.SIGN_IN));
    }

    yield call(setToken, token);

    yield put(ValidationRules.actions.setLoadingList({ loadingList }));
    yield put(ValidationRules.actions.setLoadingList({ loadingList: authList, pathOverride: authPath }));

    if (yield call(getUserMe, { apiUrl, apiPath, token })) {
      yield takeLatest(constants.LOAD_USER_ME, getUserMe, { apiUrl, apiPath, token });
      yield takeLatest(constants.UPDATE_USER_ME, updateUserMe, { apiUrl, apiPath, token });
      yield take(Auth.constants.SIGN_OUT);
    } else {
      yield put(Auth.actions.signOut());
    }
    token = null;
    yield call(setToken, token);
    // TODO: clean up state
  }
}

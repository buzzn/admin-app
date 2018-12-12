import { put, take, select, call, takeLatest, fork, race, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { SubmissionError } from 'redux-form';
import Auth from '@buzzn/module_auth';
import Bubbles from '@buzzn/module_bubbles';
import Charts from '@buzzn/module_charts';
import { logException, getAllUrlParams } from '_util';
import { actions, constants } from 'actions';
import api from 'api';

import Groups from 'groups';
import Meters from 'meters';
import Registers from 'registers';
import Users from 'users';
import Organizations from 'organizations';
import Contracts from 'contracts';
import Readings from 'readings';
import MarketLocations from 'market_locations';
import BillingCycles from 'billing_cycles';
import Billings from 'billings';
import Devices from 'devices';
import WebsiteForms from 'website_forms';
import ValidationRules from 'validation_rules';

import loadingList, { authList } from 'validation_rules_list';

export const getConfig = state => state.config;
export const getAuth = state => state.auth;
export const getUI = state => state.app.ui;
export const getBuildDate = state => state.app.buildDate;

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

export function* setToken(token) {
  yield put(Bubbles.actions.setToken(token));
  yield put(Charts.actions.setToken(token));
  yield put(Groups.actions.setToken(token));
  yield put(Meters.actions.setToken(token));
  yield put(Registers.actions.setToken(token));
  yield put(Users.actions.setToken(token));
  yield put(Organizations.actions.setToken(token));
  yield put(Contracts.actions.setToken(token));
  yield put(Readings.actions.setToken(token));
  yield put(MarketLocations.actions.setToken(token));
  yield put(BillingCycles.actions.setToken(token));
  yield put(Billings.actions.setToken(token));
  yield put(Devices.actions.setToken(token));
  yield put(WebsiteForms.actions.setToken(token));
  yield put(ValidationRules.actions.setToken(token));
}

export function* setHealth({ apiUrl }) {
  while (true) {
    try {
      const health = yield call(api.fetchHealth, { apiUrl });
      yield put(actions.setHealth(health));
    } catch (error) {
      logException(error);
      yield put(actions.setHealth({}));
    }
    yield call(delay, 60 * 1000);
  }
}

export function* checkVersion({ versionPath, buildDate }) {
  while (true) {
    try {
      const remoteVersion = yield call(api.fetchVersion, { versionPath });
      if (remoteVersion.buildDate !== buildDate) {
        yield put(actions.setVersionMismatch(true));
      }
    } catch (error) {
      logException(error);
    }
    yield call(delay, 60 * 1000);
  }
}

export function* setUI() {
  const devModeUrl = getAllUrlParams().devmode;
  let ui = yield call(api.getUI);
  if (devModeUrl) {
    ui.devMode = devModeUrl === 'true';
    yield call(api.setUI, ui);
  }
  yield put(actions.setUI(ui));

  while (true) {
    yield race({
      ui: take(constants.SET_UI),
      sort: take(constants.SET_TABLE_SORT),
    });
    ui = yield select(getUI);
    yield call(api.setUI, ui);
  }
}

export function* initialLoadPause() {
  yield all([
    take(constants.SET_HEALTH),
    delay(2000),
  ]);

  yield put(actions.setAppLoading(false));
}

export default function* () {
  const { apiUrl, apiPath, authPath, websitePath, secure, versionPath } = yield select(getConfig);
  const buildDate = yield select(getBuildDate);

  if (secure && window.location.protocol !== 'https:') {
    window.location.href = `https:${window.location.href.substring(window.location.protocol.length)}`;
  }

  yield fork(initialLoadPause);

  yield put(Auth.actions.setApiParams({ apiUrl, apiPath: authPath }));
  yield put(Bubbles.actions.setApiParams({ apiUrl, apiPath: `${apiPath}/localpools` }));
  yield put(Charts.actions.setApiParams({ apiUrl, apiPath: `${apiPath}/localpools` }));
  yield put(Groups.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Meters.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Registers.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Users.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Organizations.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Contracts.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Readings.actions.setApiParams({ apiUrl, apiPath }));
  yield put(MarketLocations.actions.setApiParams({ apiUrl, apiPath }));
  yield put(BillingCycles.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Billings.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Devices.actions.setApiParams({ apiUrl, apiPath }));
  yield put(WebsiteForms.actions.setApiParams({ apiUrl, apiPath: websitePath }));
  yield put(ValidationRules.actions.setApiParams({ apiUrl, apiPath }));

  yield fork(setHealth, { apiUrl });
  yield fork(checkVersion, { versionPath, buildDate });
  yield fork(setUI);

  let { token } = yield select(getAuth);

  while (true) {
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

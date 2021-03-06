import { put, take, select, call, takeLatest, takeLeading, fork, race, all, delay } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import Auth from '@buzzn/module_auth';
import { logException, getAllUrlParams, convertErrors } from '_util';
import { actions, constants } from 'actions';
import api from 'api';

import BillingCycles from 'billing_cycles';
import Billings from 'billings';
import Comments from 'comments';
import Contracts from 'contracts';
import Devices from 'devices';
import Groups from 'groups';
import MarketLocations from 'market_locations';
import Meters from 'meters';
import Organizations from 'organizations';
import Readings from 'readings';
import Registers from 'registers';
import Reports from 'reports';
import Tariffs from 'tariffs';
import Users from 'users';
import WebsiteForms from 'website_forms';
import ValidationRules from 'validation_rules';
import { validationRulesSagas } from 'validation_rules/sagas';

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
    if (res._error && res.errors) {
      yield call(reject, new SubmissionError(convertErrors(res.errors)));
    } else {
      yield call(resolve, res);
      yield call(getUserMe, { apiUrl, apiPath, token });
    }
  } catch (error) {
    logException(error);
  }
}

export function* setToken(token) {
  yield put(BillingCycles.actions.setToken(token));
  yield put(Billings.actions.setToken(token));
  yield put(Comments.actions.setToken(token));
  yield put(Contracts.actions.setToken(token));
  yield put(Devices.actions.setToken(token));
  yield put(Groups.actions.setToken(token));
  yield put(MarketLocations.actions.setToken(token));
  yield put(Meters.actions.setToken(token));
  yield put(Organizations.actions.setToken(token));
  yield put(Readings.actions.setToken(token));
  yield put(Registers.actions.setToken(token));
  yield put(Reports.actions.setToken(token));
  yield put(Tariffs.actions.setToken(token));
  yield put(Users.actions.setToken(token));
  yield put(ValidationRules.actions.setToken(token));
  yield put(WebsiteForms.actions.setToken(token));
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
    yield delay(60 * 1000);
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
    yield delay(60 * 1000);
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
      filter: take(constants.SET_TABLE_FILTER),
    });
    ui = yield select(getUI);
    yield call(api.setUI, ui);
  }
}

export function* initialLoadPause() {
  yield all([take(constants.SET_HEALTH), delay(2000)]);

  yield put(actions.setAppLoading(false));
}

export function* setDevLogin() {
  if (process.env.DEV_LOGIN && process.env.DEV_PASS) {
    yield put(Auth.actions.setLogin(process.env.DEV_LOGIN));
    yield put(Auth.actions.setPassword(process.env.DEV_PASS));
  }
}

export default function* () {
  const { apiUrl, apiPath, authPath, websitePath, secure, versionPath } = yield select(getConfig);
  const buildDate = yield select(getBuildDate);

  if (secure && window.location.protocol !== 'https:') {
    window.location.href = `https:${window.location.href.substring(window.location.protocol.length)}`;
  }

  // yield fork(initialLoadPause);

  yield put(Auth.actions.setApiParams({ apiUrl, apiPath: authPath }));
  yield put(BillingCycles.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Billings.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Comments.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Contracts.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Devices.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Groups.actions.setApiParams({ apiUrl, apiPath }));
  yield put(MarketLocations.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Meters.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Organizations.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Readings.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Registers.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Reports.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Tariffs.actions.setApiParams({ apiUrl, apiPath }));
  yield put(Users.actions.setApiParams({ apiUrl, apiPath }));
  yield put(ValidationRules.actions.setApiParams({ apiUrl, apiPath }));
  yield put(WebsiteForms.actions.setApiParams({ apiUrl, apiPath: websitePath }));

  yield fork(setHealth, { apiUrl });
  yield fork(checkVersion, { versionPath, buildDate });
  yield fork(setUI);

  let { token } = yield select(getAuth);

  while (true) {
    if (!token) {
      yield put(actions.setAppLoading(false));
      yield call(setDevLogin);
      ({ token } = yield take(Auth.constants.SIGN_IN));
    }

    yield call(setToken, token);

    yield put(actions.setAppLoading(true));
    yield call(validationRulesSagas, { apiUrl, apiPath, token }, { loadingList });
    yield call(validationRulesSagas, { apiUrl, apiPath, token }, { loadingList: authList, pathOverride: authPath });
    yield put(actions.setAppLoading(false));

    if (yield call(getUserMe, { apiUrl, apiPath, token })) {
      yield takeLatest(constants.LOAD_USER_ME, getUserMe, { apiUrl, apiPath, token });
      yield takeLeading(constants.UPDATE_USER_ME, updateUserMe, { apiUrl, apiPath, token });
      yield take(Auth.constants.SIGN_OUT);
    } else {
      yield put(Auth.actions.signOut());
    }
    token = null;
    yield call(setToken, token);
    // TODO: clean up state
  }
}

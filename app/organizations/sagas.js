import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

export const getOrganizationsFunctions = {
  availableOrganizations: {
    loading: actions.loadingAvailableOrganizations,
    set: actions.setAvailableOrganizations,
    fetch: api.fetchAvailableOrganizations,
    loaded: actions.loadedAvailableOrganizations,
  },
  availableOrganizationMarkets: {
    loading: actions.loadingAvailableOrganizationMarkets,
    set: actions.setAvailableOrganizationMarkets,
    fetch: api.fetchAvailableOrganizationMarkets,
    loaded: actions.loadedAvailableOrganizationMarkets,
  },
};

export const selectOrganizationId = state => state.organizations.organizationId;
export const selectGroupId = state => state.organizations.groupId;

export function* getOrganization({ apiUrl, apiPath, token }, { organizationId }) {
  yield put(actions.loadingOrganization());
  try {
    const organization = yield call(api.fetchOrganization, { apiUrl, apiPath, token, organizationId });
    yield put(actions.setOrganization(organization));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedOrganization());
}

export function* getGroupOrganization({ apiUrl, apiPath, token }, { organizationId, groupId }) {
  yield put(actions.loadingGroupOrganization());
  try {
    const organization = yield call(api.fetchGroupOrganization, { apiUrl, apiPath, token, organizationId, groupId });
    yield put(actions.setGroupOrganization(organization));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroupOrganization());
}

export function* getOrganizations({ apiUrl, apiPath, token, type }, params) {
  yield put(getOrganizationsFunctions[type].loading());
  try {
    const organizations = yield call(getOrganizationsFunctions[type].fetch, { apiUrl, apiPath, token, ...params });
    yield put(getOrganizationsFunctions[type].set(organizations));
  } catch (error) {
    logException(error);
  }
  yield put(getOrganizationsFunctions[type].loaded());
}

export function* organizationsSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_ORGANIZATION, getOrganization, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_GROUP_ORGANIZATION, getGroupOrganization, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_AVAILABLE_ORGANIZATIONS, getOrganizations, {
    apiUrl,
    apiPath,
    token,
    type: 'availableOrganizations',
  });
  yield takeLatest(constants.LOAD_AVAILABLE_ORGANIZATION_MARKETS, getOrganizations, {
    apiUrl,
    apiPath,
    token,
    type: 'availableOrganizationMarkets',
  });

  const organizationId = yield select(selectOrganizationId);
  const groupId = yield select(selectGroupId);
  if (organizationId && groupId) yield put(actions.loadGroupOrganization({ organizationId, groupId }));
  if (organizationId) yield put(actions.loadOrganization({ organizationId }));
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(organizationsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

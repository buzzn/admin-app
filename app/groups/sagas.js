import { put, call, takeLatest, takeLeading, take, fork, cancel, select } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

export const selectGroupId = state => state.groups.groupId;

export function* getGroups({ apiUrl, apiPath, token }) {
  yield put(actions.loadingGroups());
  try {
    const groups = yield call(api.fetchGroups, { apiUrl, apiPath, token });
    yield put(actions.setGroups(groups));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroups());
}

export function* getGroup({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingGroup());
  try {
    const group = yield call(api.fetchGroup, { apiUrl, apiPath, token, groupId });
    yield put(actions.setGroup(group));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroup());
}

export function* addGroup({ apiUrl, apiPath, token }, { params, resolve, reject }) {
  try {
    const res = yield call(api.addGroup, { apiUrl, apiPath, token, params });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield put(actions.loadGroups());
    }
  } catch (error) {
    logException(error);
  }
}

export function* updateGroup({ apiUrl, apiPath, token }, { params, resolve, reject, groupId }) {
  const orgMarketUpd = {
    transmissionSystemOperator: api.updateGroupTSO,
    distributionSystemOperator: api.updateGroupDSO,
    electricitySupplier: api.updateGroupES,
  };
  try {
    const errs = {};
    let { updatedAt } = params;
    for (const key of Object.keys(params.orgMarket || {})) {
      const res = yield call(orgMarketUpd[key], {
        apiUrl,
        apiPath,
        token,
        params: {
          organizationId: params.orgMarket[key],
          updatedAt,
        },
        groupId,
      });
      if (res._error) {
        errs[key] = res;
      } else {
        updatedAt = res.updated_at;
      }
    }
    const res = yield call(api.updateGroup, { apiUrl, apiPath, token, params: { ...params, updatedAt }, groupId });
    if (res._error || Object.keys(errs).length) {
      yield call(reject, new SubmissionError({ ...res, ...errs }));
    } else {
      yield call(resolve, res);
      yield put(actions.loadGroup(groupId));
    }
  } catch (error) {
    logException(error);
  }
}

export function* deleteGroup({ apiUrl, apiPath, token }, { groupId }) {
  try {
    yield call(api.deleteGroup, { apiUrl, apiPath, token, groupId });
    yield put(actions.loadGroups());
  } catch (error) {
    logException(error);
  }
}

export function* updateContact(
  { apiUrl, apiPath, token },
  { groupId, params, update, contactId, contactType, isGap, resolve, reject },
) {
  try {
    const res = yield call(api.updateGroupContact, {
      apiUrl,
      apiPath,
      token,
      params,
      groupId,
      update,
      contactId,
      contactType,
      isGap,
    });
    if (res._error) {
      yield call(reject, new SubmissionError(res));
    } else {
      yield call(resolve, res);
      yield put(actions.loadGroup(groupId));
    }
  } catch (error) {
    logException(error);
  }
}

export function* groupsSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_GROUPS, getGroups, { apiUrl, apiPath, token });
  yield takeLatest(constants.LOAD_GROUP, getGroup, { apiUrl, apiPath, token });
  yield takeLeading(constants.ADD_GROUP, addGroup, { apiUrl, apiPath, token });
  yield takeLeading(constants.UPDATE_GROUP, updateGroup, { apiUrl, apiPath, token });
  yield takeLeading(constants.DELETE_GROUP, deleteGroup, { apiUrl, apiPath, token });
  yield takeLeading(constants.UPDATE_CONTACT, updateContact, { apiUrl, apiPath, token });
  yield put(actions.loadGroups());
  const groupId = yield select(selectGroupId);
  if (groupId) yield put(actions.loadGroup(groupId));
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(groupsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

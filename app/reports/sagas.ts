import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

const selectReports = state => state.reports;

export function* getEeg({ apiPath, apiUrl, token }, { groupId, params }) {
  yield put(actions.loadingEeg());
  try {
    const eegReport = yield call(api.fetchEegReport, { apiUrl, apiPath, token, groupId, params });
    yield put(actions.setEeg(eegReport));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedEeg());
}

export function* getAnnualReport({ apiUrl, apiPath, token }, { groupId, groupName, params}) {
  yield put(actions.loadingAnnualReport());
  try {
    const report = yield call(api.fetchAnnualReport,
                              { apiUrl, apiPath, token, groupId, params });
    saveAs(report, 'AnnualReport_' + groupName + '.xlsx');
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedAnnualReport());
}

export function* getGroupMembersExport({ apiUrl, apiPath, token }, {groupId, groupName, errorFn}) {
  yield put(actions.loadingGroupMembersExport());
  try {
    const groupMembersExported = yield call(api.fetchGroupMembersExport, { apiUrl, apiPath, token, groupId });
    if(groupMembersExported.errors) {
      errorFn(groupMembersExported.errors);
    } else {
      let groupNameSanitized = groupName.replace(/[^a-z0-9]/gi, '_') + "_GroupMembers.csv";
      saveAs(groupMembersExported, `${groupNameSanitized}`);
    }
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedGroupMembersExport());
}

export function* getTariffChangeLettersZip({ apiUrl, apiPath, token }, { groupId, groupName }) {
  try {
    const data = yield call(api.fetchTariffChangeLettersZip, { apiUrl, apiPath, token, groupId });
    // @ts-ignore
    saveAs(data, `Preisanpassung_${groupName}.zip`);
  } catch (error) {
    logException(error);
  }
}

export function* sendTariffChangeLetters({ apiUrl, apiPath, token }, { groupId }) {
  try {
    yield call(api.fetchSendTariffChangeLetters, { apiUrl, apiPath, token, groupId });
  } catch (error) {
    logException(error);
  }
}

export function* reportsSagas({ apiUrl, apiPath, token }) {
  // @ts-ignore
  yield takeLatest(constants.LOAD_EEG, getEeg, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLatest(constants.LOAD_ANNUAL_REPORT, getAnnualReport, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLatest(constants.LOAD_GROUP_MEMBERS_EXPORT, getGroupMembersExport, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLatest(constants.GET_TARIFF_CHANGE_LETTERS, getTariffChangeLettersZip, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLatest(constants.SEND_TARIFF_CHANGE_LETTERS, sendTariffChangeLetters, { apiUrl, apiPath, token });

  const { groupId, eegParams } = yield select(selectReports);
  if (groupId && eegParams) yield put(actions.loadEeg({ groupId, params: eegParams }));
  // @ts-ignore
  if(groupId) yield put(actions.loadGroupMembersExport());
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(reportsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

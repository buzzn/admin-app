import { EegReport } from './reducers';

export const constants = {
  SET_API_PARAMS: 'buzzn_reports/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_reports/SET_TOKEN',

  LOAD_EEG: 'buzzn_reports/LOAD_EEG',
  LOADING_EEG: 'buzzn_reports/LOADING_EEG',
  LOADED_EEG: 'buzzn_reports/LOADED_EEG',
  SET_EEG: 'buzzn_reports/SET_EEG',

  LOAD_ANNUAL_REPORT: 'buzzn_reports/LOAD_ANNUAL_REPORT',
  LOADING_ANNUAL_REPORT: 'buzzn_reports/LOADING_ANNUAL_REPORT',
  LOADED_ANNUAL_REPORT: 'buzzn_reports/LOADED_ANNUAL_REPORT',

  LOAD_GROUP_MEMBERS_EXPORT: 'buzzn_groups/LOAD_GROUP_MEMBERS_EXPORT',
  LOADING_GROUP_MEMBERS_EXPORT: 'buzzn_groups/LOADING_GROUP_MEMBERS_EXPORT',
  LOADED_GROUP_MEMBERS_EXPORT: 'buzzn_groups/LOADED_GROUP_MEMBERS_EXPORT',

  GET_TARIFF_CHANGE_LETTERS: 'buzzn_groups/GET_TARIFF_CHANGE_LETTERS',
  SEND_TARIFF_CHANGE_LETTERS: 'buzzn_groups/SEND_TARIFF_CHANGE_LETTERS',

  GET_HISTORICAL_READINGS_EXPORT_ID: 'buzzn_groups/GET_HISTORICAL_READINGS_EXPORT_ID',
  GET_HISTORICAL_READINGS_EXPORT: 'buzzn_groups/GET_HISTORICAL_READINGS_EXPORT',

  GET_THIRD_PARTY_EXPORT_ID: 'buzzn_groups/GET_THIRD_PARTY_EXPORT_ID',
  GET_THIRD_PARTY_EXPORT: 'buzzn_groups/GET_THIRD_PARTY_EXPORT'
};

// FIXME: extract to common types, fix 'typeof'
interface SetApiParamsAction {
  type: typeof constants.SET_API_PARAMS;
  apiPath: string;
  apiUrl: string;
}
interface SetTokenAction {
  type: typeof constants.SET_TOKEN;
  token: string;
}
interface LoadEegAction {
  type: typeof constants.LOAD_EEG;
  groupId: string;
  params: { beginDate: Date; lastDate: Date };
}
interface LoadingEegAction {
  type: typeof constants.LOADING_EEG;
}
interface LoadedEegAction {
  type: typeof constants.LOADED_EEG;
}
interface SetEegAction {
  type: typeof constants.SET_EEG;
  eegReport: EegReport;
}

interface LoadAnnualReportAction {
  type: typeof constants.LOAD_ANNUAL_REPORT;
  groupId: string;
  groupName: string;
  params: { beginDate: Date; lastDate: Date };
}
interface LoadingAnnualReportAction {
  type: typeof constants.LOADING_ANNUAL_REPORT;
}
interface LoadedAnnualReportAction {
  type: typeof constants.LOADED_ANNUAL_REPORT;
}

export type ReportsActions = | SetApiParamsAction
  | SetTokenAction
  | LoadEegAction
  | LoadingEegAction
  | LoadedEegAction
  | SetEegAction
  | LoadAnnualReportAction
  | LoadingAnnualReportAction
  | LoadedAnnualReportAction;

export const actions = {
  setApiParams: ({ apiPath, apiUrl }: { apiPath: string; apiUrl: string }): SetApiParamsAction => ({
    type: constants.SET_API_PARAMS,
    apiPath,
    apiUrl,
  }),
  setToken: (token: string): SetTokenAction => ({ type: constants.SET_TOKEN, token }),
  loadEeg: ({ groupId, params }: { groupId: string; params: { beginDate: Date; lastDate: Date } }): LoadEegAction => ({
    type: constants.LOAD_EEG,
    groupId,
    params,
  }),
  loadingEeg: (): LoadingEegAction => ({ type: constants.LOADING_EEG }),
  loadedEeg: (): LoadedEegAction => ({ type: constants.LOADED_EEG }),
  setEeg: (eegReport: EegReport): SetEegAction => ({ type: constants.SET_EEG, eegReport }),

  loadAnnualReport: ({ groupId, groupName, params }:
    { groupId: string; groupName: string; params: { beginDate: Date; lastDate: Date } }):
    LoadAnnualReportAction => ({
      type: constants.LOAD_ANNUAL_REPORT,
      groupId,
      groupName,
      params,
    }),
  loadingAnnualReport: (): LoadingAnnualReportAction => ({ type: constants.LOADING_ANNUAL_REPORT }),
  loadedAnnualReport: (): LoadedAnnualReportAction => ({ type: constants.LOADED_ANNUAL_REPORT }),
  
  loadGroupMembersExport: (groupId: string, groupName: string, errorFn: Function) => ({ type: constants.LOAD_GROUP_MEMBERS_EXPORT, groupId, groupName, errorFn }),
  loadingGroupMembersExport: () => ({ type: constants.LOADING_GROUP_MEMBERS_EXPORT }),
  loadedGroupMembersExport: () => ({ type: constants.LOADED_GROUP_MEMBERS_EXPORT }),

  getTariffChangeLetters: (groupId: string, groupName: string) => ({ type: constants.GET_TARIFF_CHANGE_LETTERS, groupId, groupName}),
  sendTariffChangeLettersEmails: (groupId: string) => ({ type: constants.SEND_TARIFF_CHANGE_LETTERS, groupId}),


  getHistoricalReadingsExportId: ({ groupId, groupName, resolve, reject }) => ({
    type: constants.GET_HISTORICAL_READINGS_EXPORT_ID,
    groupId,
    groupName,
    resolve,
    reject,
  }),

  getHistoricalReadingsExport: ({ groupId, groupName, reportId, resolve, reject }) => ({
    type: constants.GET_HISTORICAL_READINGS_EXPORT,
    groupId,
    groupName,
    reportId,
    resolve,
    reject,
  }),

  getThirdPartyExportId: ({ groupId, groupName, resolve, reject }) => ({
    type: constants.GET_THIRD_PARTY_EXPORT_ID,
    groupId,
    groupName,
    resolve,
    reject,
  }),

  getThirdPartyExport: ({ groupId, groupName, reportId, resolve, reject }) => ({
    type: constants.GET_THIRD_PARTY_EXPORT,
    groupId,
    groupName,
    reportId,
    resolve,
    reject,
  }),
};

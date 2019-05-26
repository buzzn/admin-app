import { EegReport } from './reducers';

export const constants = {
  SET_API_PARAMS: 'buzzn_reports/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_reports/SET_TOKEN',

  LOAD_EEG: 'buzzn_reports/LOAD_EEG',
  LOADING_EEG: 'buzzn_reports/LOADING_EEG',
  LOADED_EEG: 'buzzn_reports/LOADED_EEG',
  SET_EEG: 'buzzn_reports/SET_EEG',
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

export type ReportsActions = | SetApiParamsAction
  | SetTokenAction
  | LoadEegAction
  | LoadingEegAction
  | LoadedEegAction
  | SetEegAction;

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
};

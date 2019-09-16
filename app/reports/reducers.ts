import { constants, ReportsActions } from './actions';

// FIXME: extract to api type definitions
export type EegReportStruct = {
  _status: 200;
  greedFeedingWh: number;
  gridConsumptionCorrected: number;
  gridConsumptionWh: number;
  normalWh: number;
  productionWh: number;
  reducedWh: number;
  thirdPartyWh: number;
  veeg: number;
  veegReduced: number;
  warnings: any[];
};
export type EegReport = { _status: null | number } | EegReportStruct;

// FIXME: extract to state definition
export interface ReportsState {
  groupId: string;
  eegParams: null | { beginDate: Date; endDate: Date };
  annualReportParams: null | { beginDate: Date; endDate: Date };
  loadingEeg: boolean;
  eegReport: EegReport;
  loadingAnnualReport: boolean;
  loadingGroupMembersExport: boolean,
}

export const initialState: ReportsState = {
  groupId: '',
  eegParams: null,
  annualReportParams:null,
  eegReport: { _status: null },
  loadingEeg: false,
  loadingGroupMembersExport: false,
  loadingAnnualReport: false  
};

export default function (state = initialState, action: ReportsActions): ReportsState {
  switch (action.type) {
    case constants.LOAD_EEG:
      // @ts-ignore
      return { ...state, groupId: action.groupId, eegParams: action.params };
    case constants.LOADING_EEG:
      return { ...state, loadingEeg: true };
    case constants.LOADED_EEG:
      return { ...state, loadingEeg: false };
    case constants.SET_EEG:
      // @ts-ignore
      return { ...state, eegReport: action.eegReport };

    case constants.LOAD_ANNUAL_REPORT:
       // @ts-ignore
      return {...state, groupId: action.groupId, groupName: action.groupName, annualReportParams: action.params };
    case constants.LOADING_ANNUAL_REPORT:
      return { ...state, loadingAnnualReport: true };
    case constants.LOADED_ANNUAL_REPORT:
      return { ...state, loadingAnnualReport: false };

    case constants.LOADING_GROUP_MEMBERS_EXPORT:
      return { ...state, loadingGroupMembersExport: true };
    case constants.LOADED_GROUP_MEMBERS_EXPORT:
      return { ...state, loadingGroupMembersExport: false };

    default:
      return state;
  }
}

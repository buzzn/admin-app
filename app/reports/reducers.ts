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
  loadingEeg: boolean;
  eegReport: EegReport;
}

export const initialState: ReportsState = {
  groupId: '',
  eegParams: null,
  loadingEeg: false,
  eegReport: { _status: null },
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
    default:
      return state;
  }
}

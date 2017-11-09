// @flow
import get from 'lodash/get';
import { constants } from './actions';
import type { MetersAction } from './actions';

export const initialState = {
  loadingGroupMeters: false,
  loadingMeter: false,
  groupMeters: { _status: null, array: [] },
  meter: { _status: null },
  meterRegisters: { _status: null, array: [] },
  realValidationRules: { _status: null },
  virtualValidationRules: { _status: null },
};

export type MetersState = {
  +loadingGroupMeters: boolean,
  +loadingMeter: boolean,
  +groupMeters: { _status: null | number, array?: Array<Object> },
  +meter: Object,
  +meterRegisters: { _status: null | number, array: Array<Object> },
  +realValidationRules: Object,
  +virtualValidationRules: Object,
};

export default function (state: MetersState = initialState, action: MetersAction): MetersState {
  switch (action.type) {
    case constants.LOAD_METER:
      return { ...state, meterId: action.meterId, groupId: action.groupId };
    case constants.LOADING_METER:
      return { ...state, loadingMeter: true };
    case constants.LOADED_METER:
      return { ...state, loadingMeter: false };
    case constants.SET_METER:
      return { ...state, meter: action.meter, meterRegisters: action.meter.registers };

    case constants.LOAD_GROUP_METERS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_GROUP_METERS:
      return { ...state, loadingGroupMeters: true };
    case constants.LOADED_GROUP_METERS:
      return { ...state, loadingGroupMeters: false };
    case constants.SET_GROUP_METERS:
      return { ...state, groupMeters: action.groupMeters };

    case constants.SET_TOKEN:
      return { ...state };

    case constants.SET_REAL_VALIDATION_RULES:
      return { ...state, realValidationRules: action.realValidationRules };
    case constants.SET_VIRTUAL_VALIDATION_RULES:
      return { ...state, virtualValidationRules: action.virtualValidationRules };

    default:
      return state;
  }
}

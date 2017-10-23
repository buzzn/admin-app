import get from 'lodash/get';
import { constants } from './actions';

export const initialState = {
  configured: false,
  loadingGroupMeters: false,
  loadingMeter: false,
  groupMeters: [],
  meter: {},
  meterRegisters: [],
  realValidationRules: {},
  virtualValidationRules: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_METER:
      return { ...state, meterId: action.meterId, groupId: action.groupId };
    case constants.LOADING_METER:
      return { ...state, loadingMeter: true };
    case constants.LOADED_METER:
      return { ...state, loadingMeter: false };
    case constants.SET_METER:
      return { ...state, meter: action.meter, meterRegisters: get(action.meter, 'registers.array', []) };

    case constants.LOAD_GROUP_METERS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_GROUP_METERS:
      return { ...state, loadingGroupMeters: true };
    case constants.LOADED_GROUP_METERS:
      return { ...state, loadingGroupMeters: false };
    case constants.SET_GROUP_METERS:
      return { ...state, groupMeters: action.groupMeters };

    case constants.SET_TOKEN:
      return { ...state, configured: true };

    case constants.SET_REAL_VALIDATION_RULES:
      return { ...state, realValidationRules: action.realValidationRules };
    case constants.SET_VIRTUAL_VALIDATION_RULES:
      return { ...state, virtualValidationRules: action.virtualValidationRules };

    default:
      return state;
  }
}

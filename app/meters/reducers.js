import { constants } from './actions';

export const initialState = {
  loadingGroupMeters: false,
  loadingMeter: false,
  groupMeters: { _status: null, array: [] },
  meter: { _status: null },
  meterRegisters: { _status: null, array: [] },
  validationRules: {
    realCreate: { _status: null },
    realUpdate: { _status: null },
    virtualUpdate: { _status: null },
  },
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

    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: { ...state.validationRules, [action.ruleType]: action.validationRules } };

    default:
      return state;
  }
}

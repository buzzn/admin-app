import { constants } from './actions';

export const initialState = {
  loadingDevices: false,
  loadingDevice: false,
  devices: { _status: null, array: [] },
  device: { _status: null },
  validationRules: { create: { _status: null }, update: { _status: null } },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: { ...state.validationRules, [action.ruleType]: action.validationRules } };

    case constants.LOAD_DEVICE:
      return { ...state, deviceId: action.deviceId, groupId: action.groupId };
    case constants.LOADING_DEVICE:
      return { ...state, loadingDevice: true };
    case constants.LOADED_DEVICE:
      return { ...state, loadingDevice: false };
    case constants.SET_DEVICE:
      return { ...state, device: action.device };

    case constants.LOAD_DEVICES:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_DEVICES:
      return { ...state, loadingDevices: true };
    case constants.LOADED_DEVICES:
      return { ...state, loadingDevices: false };
    case constants.SET_DEVICES:
      return { ...state, devices: action.devices };

    default:
      return state;
  }
}

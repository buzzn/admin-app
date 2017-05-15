import { constants } from './actions';

export const initialState = {
  configured: false,
  loadingGroupMeters: false,
  loadingMeter: false,
  groupMeters: [],
  meter: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_METER:
      return { ...state, meterId: action.meterId };
    case constants.LOADING_METER:
      return { ...state, loadingMeter: true };
    case constants.LOADED_METER:
      return { ...state, loadingMeter: false };
    case constants.SET_METER:
      return { ...state, meter: action.meter };

    case constants.LOAD_GROUP_METERS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_GROUP_METERS:
      return { ...state, loadingUserMeters: true };
    case constants.LOADED_GROUP_METERS:
      return { ...state, loadingUserMeters: false };
    case constants.SET_GROUP_METERS:
      return { ...state, groupMeters: action.groupMeters };

    case constants.SET_TOKEN:
      return { ...state, configured: true };

    default:
      return state;
  }
}

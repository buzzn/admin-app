import { constants } from './actions';

export const initialState = {
  configured: false,
  loadingMeters: false,
  loadingUserMeters: false,
  loadingMeter: false,
  userMeters: [],
  meter: null,
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

    case constants.LOADING_USER_METERS:
      return { ...state, loadingUserMeters: true };
    case constants.LOADED_USER_METERS:
      return { ...state, loadingUserMeters: false };
    case constants.SET_USER_METERS:
      return { ...state, userMeters: action.userMeters };

    case constants.SET_TOKEN:
      return { ...state, configured: true };

    default:
      return state;
  }
}

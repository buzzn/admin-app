import { constants } from './actions';

export const initialState = {
  configured: false,
  loadingMeters: false,
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

    case constants.LOADING_METERS:
      return { ...state, loadingMeters: true };
    case constants.LOADED_METERS:
      return { ...state, loadingMeters: false };
    case constants.SET_METERS:
      return { ...state, meters: action.meters };

    case constants.SET_TOKEN:
      return { ...state, configured: true };

    default:
      return state;
  }
}

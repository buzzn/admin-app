import { constants } from './actions';

export const initialState = {
  loadingMarketLocations: false,
  loadingMarketLocation: false,
  marketLocations: { _status: null, array: [] },
  marketLocation: { _status: null },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_MARKET_LOCATION:
      return { ...state, locationId: action.locationId, groupId: action.groupId };
    case constants.LOADING_MARKET_LOCATION:
      return { ...state, loadingMarketLocation: true };
    case constants.LOADED_MARKET_LOCATION:
      return { ...state, loadingMarketLocation: false };
    case constants.SET_MARKET_LOCATION:
      return { ...state, marketLocation: action.marketLocation };

    case constants.LOAD_MARKET_LOCATIONS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_MARKET_LOCATIONS:
      return { ...state, loadingMarketLocations: true };
    case constants.LOADED_MARKET_LOCATIONS:
      return { ...state, loadingMarketLocations: false };
    case constants.SET_MARKET_LOCATIONS:
      return { ...state, marketLocations: action.marketLocations };

    default:
      return state;
  }
}

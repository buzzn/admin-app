import { constants } from './actions';

export const initialState = {
  loadingAvailableOrganizations: false,
  loadingAvailableOrganizationMarkets: false,
  availableOrganizations: { _status: null, array: [] },
  availableOrganizationMarkets: { _status: null, array: [] },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_AVAILABLE_ORGANIZATIONS:
      return { ...state };
    case constants.LOADING_AVAILABLE_ORGANIZATIONS:
      return { ...state, loadingAvailableOrganizations: true };
    case constants.LOADED_AVAILABLE_ORGANIZATIONS:
      return { ...state, loadingAvailableOrganizations: false };
    case constants.SET_AVAILABLE_ORGANIZATIONS:
      return { ...state, availableOrganizations: action.availableOrganizations };

    case constants.LOAD_AVAILABLE_ORGANIZATION_MARKETS:
      return { ...state };
    case constants.LOADING_AVAILABLE_ORGANIZATION_MARKETS:
      return { ...state, loadingAvailableOrganizationMarkets: true };
    case constants.LOADED_AVAILABLE_ORGANIZATION_MARKETS:
      return { ...state, loadingAvailableOrganizationMarkets: false };
    case constants.SET_AVAILABLE_ORGANIZATION_MARKETS:
      return { ...state, availableOrganizationMarkets: action.availableOrganizationMarkets };

    default:
      return state;
  }
}

import { constants } from './actions';

export const initialState = {
  loadingOrganization: false,
  loadingGroupOrganization: false,
  loadingAvailableOrganizations: false,
  loadingAvailableOrganizationMarkets: false,
  organization: { _status: null },
  groupOrganization: { _status: null },
  availableOrganizations: { _status: null, array: [] },
  availableOrganizationMarkets: { _status: null, array: [] },
  validationRules: {
    orgMarketCreate: { _status: null },
    orgMarketUpdate: { _status: null },
    orgMarketAddFunction: { _status: null },
    marketFunctionUpdate: { _status: null },
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_ORGANIZATION:
      return { ...state, organizationId: action.organizationId };
    case constants.LOADING_ORGANIZATION:
      return { ...state, loadingOrganization: true };
    case constants.LOADED_ORGANIZATION:
      return { ...state, loadingOrganization: false };
    case constants.SET_ORGANIZATION:
      return { ...state, organization: action.organization };

    case constants.LOAD_GROUP_ORGANIZATION:
      return { ...state, organizationId: action.organizationId, groupId: action.groupId };
    case constants.LOADING_GROUP_ORGANIZATION:
      return { ...state, loadingGroupOrganization: true };
    case constants.LOADED_GROUP_ORGANIZATION:
      return { ...state, loadingGroupOrganization: false };
    case constants.SET_GROUP_ORGANIZATION:
      return { ...state, groupOrganization: action.organization };

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

    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: { ...state.validationRules, [action.ruleType]: action.validationRules } };

    default:
      return state;
  }
}

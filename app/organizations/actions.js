export const constants = {
  SET_API_PARAMS: 'buzzn_organizations/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_organizations/SET_TOKEN',

  SET_VALIDATION_RULES: 'buzzn_organizations/SET_VALIDATION_RULES',

  LOAD_ORGANIZATION: 'buzzn_organizations/LOAD_ORGANIZATION',
  LOADING_ORGANIZATION: 'buzzn_organizations/LOADING_ORGANIZATION',
  LOADED_ORGANIZATION: 'buzzn_organizations/LOADED_ORGANIZATION',
  SET_ORGANIZATION: 'buzzn_organizations/SET_ORGANIZATION',

  LOAD_GROUP_ORGANIZATION: 'buzzn_organizations/LOAD_GROUP_ORGANIZATION',
  LOADING_GROUP_ORGANIZATION: 'buzzn_organizations/LOADING_GROUP_ORGANIZATION',
  LOADED_GROUP_ORGANIZATION: 'buzzn_organizations/LOADED_GROUP_ORGANIZATION',
  SET_GROUP_ORGANIZATION: 'buzzn_organizations/SET_GROUP_ORGANIZATION',

  LOAD_AVAILABLE_ORGANIZATIONS: 'buzzn_organizations/LOAD_AVAILABLE_ORGANIZATIONS',
  LOADING_AVAILABLE_ORGANIZATIONS: 'buzzn_organizations/LOADING_AVAILABLE_ORGANIZATIONS',
  LOADED_AVAILABLE_ORGANIZATIONS: 'buzzn_organizations/LOADED_AVAILABLE_ORGANIZATIONS',
  SET_AVAILABLE_ORGANIZATIONS: 'buzzn_organizations/SET_AVAILABLE_ORGANIZATIONS',

  LOAD_AVAILABLE_ORGANIZATION_MARKETS: 'buzzn_organizations/LOAD_AVAILABLE_ORGANIZATION_MARKETS',
  LOADING_AVAILABLE_ORGANIZATION_MARKETS: 'buzzn_organizations/LOADING_AVAILABLE_ORGANIZATION_MARKETS',
  LOADED_AVAILABLE_ORGANIZATION_MARKETS: 'buzzn_organizations/LOADED_AVAILABLE_ORGANIZATION_MARKETS',
  SET_AVAILABLE_ORGANIZATION_MARKETS: 'buzzn_organizations/SET_AVAILABLE_ORGANIZATION_MARKETS',

  ADD_ORGANIZATION_MARKET: 'buzzn_organizations/ADD_ORGANIZATION_MARKET',
  UPDATE_ORGANIZATION_MARKET: 'buzzn_organizations/UPDATE_ORGANIZATION_MARKET',
  ADD_FUNCTION_TO_ORGANIZATION_MARKET: 'buzzn_organizations/ADD_FUNCTION_TO_ORGANIZATION_MARKET',
  DELETE_FUNCTION_FROM_ORGANIZATION_MARKET: 'buzzn_organizations/DELETE_FUNCTION_FROM_ORGANIZATION_MARKET',
  UPDATE_ORGANIZATION_MARKET_FUNCTION: 'buzzn_organizations/UPDATE_ORGANIZATION_MARKET_FUNCTION',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setValidationRules: (ruleType, validationRules) => ({
    type: constants.SET_VALIDATION_RULES,
    ruleType,
    validationRules,
  }),

  loadOrganization: ({ organizationId }) => ({ type: constants.LOAD_ORGANIZATION, organizationId }),
  loadingOrganization: () => ({ type: constants.LOADING_ORGANIZATION }),
  loadedOrganization: () => ({ type: constants.LOADED_ORGANIZATION }),
  setOrganization: organization => ({ type: constants.SET_ORGANIZATION, organization }),

  loadGroupOrganization: ({ organizationId, groupId }) => ({
    type: constants.LOAD_GROUP_ORGANIZATION,
    organizationId,
    groupId,
  }),
  loadingGroupOrganization: () => ({ type: constants.LOADING_GROUP_ORGANIZATION }),
  loadedGroupOrganization: () => ({ type: constants.LOADED_GROUP_ORGANIZATION }),
  setGroupOrganization: organization => ({ type: constants.SET_GROUP_ORGANIZATION, organization }),

  loadAvailableOrganizations: () => ({ type: constants.LOAD_AVAILABLE_ORGANIZATIONS }),
  loadingAvailableOrganizations: () => ({ type: constants.LOADING_AVAILABLE_ORGANIZATIONS }),
  loadedAvailableOrganizations: () => ({ type: constants.LOADED_AVAILABLE_ORGANIZATIONS }),
  setAvailableOrganizations: availableOrganizations => ({
    type: constants.SET_AVAILABLE_ORGANIZATIONS,
    availableOrganizations,
  }),

  loadAvailableOrganizationMarkets: () => ({ type: constants.LOAD_AVAILABLE_ORGANIZATION_MARKETS }),
  loadingAvailableOrganizationMarkets: () => ({ type: constants.LOADING_AVAILABLE_ORGANIZATION_MARKETS }),
  loadedAvailableOrganizationMarkets: () => ({ type: constants.LOADED_AVAILABLE_ORGANIZATION_MARKETS }),
  setAvailableOrganizationMarkets: availableOrganizationMarkets => ({
    type: constants.SET_AVAILABLE_ORGANIZATION_MARKETS,
    availableOrganizationMarkets,
  }),

  addOrganizationMarket: ({ params, resolve, reject }) => ({
    type: constants.ADD_ORGANIZATION_MARKET,
    params,
    resolve,
    reject,
  }),
  updateOrganizationMarket: ({ params, resolve, reject, organizationId }) => ({
    type: constants.UPDATE_ORGANIZATION_MARKET,
    params,
    resolve,
    reject,
    organizationId,
  }),
  addFunctionToOrgMarket: ({ params, resolve, reject, organizationId }) => ({
    type: constants.ADD_FUNCTION_TO_ORGANIZATION_MARKET,
    params,
    resolve,
    reject,
    organizationId,
  }),
  deleteFunctionFromOrgMarket: ({ organizationId, functionId }) => ({
    type: constants.DELETE_FUNCTION_FROM_ORGANIZATION_MARKET,
    organizationId,
    functionId,
  }),
  updateOrganizationMarketFunction: ({ params, resolve, reject, organizationId, functionId }) => ({
    type: constants.UPDATE_ORGANIZATION_MARKET_FUNCTION,
    params,
    resolve,
    reject,
    organizationId,
    functionId,
  }),
};

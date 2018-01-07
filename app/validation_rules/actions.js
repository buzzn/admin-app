export const constants = {
  SET_API_PARAMS: 'buzzn_validation_rules/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_validation_rules/SET_TOKEN',

  SET_LOADING_LIST: 'buzzn_validation_rules/SET_LOADING_LIST',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({
    type: constants.SET_API_PARAMS,
    apiPath,
    apiUrl,
  }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setLoadingList: ({ loadingList, pathOverride }) => ({
    type: constants.SET_LOADING_LIST,
    loadingList,
    pathOverride,
  }),
};

export const constants = {
  SET_API_PARAMS: 'buzzn_tariffs/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_tariffs/SET_TOKEN',

  SET_VALIDATION_RULES: 'buzzn_tariffs/SET_VALIDATION_RULES',

  LOAD_TARIFFS: 'buzzn_tariffs/LOAD_TARIFFS',
  LOADING_TARIFFS: 'buzzn_tariffs/LOADING_TARIFFS',
  LOADED_TARIFFS: 'buzzn_tariffs/LOADED_TARIFFS',
  SET_TARIFFS: 'buzzn_tariffs/SET_TARIFFS',

  ADD_TARIFF: 'buzzn_tariffs/ADD_TARIFF',
  SET_GAP_TARIFFS: 'buzzn_tariffs/SET_GAP_TARIFFS',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setValidationRules: validationRules => ({ type: constants.SET_VALIDATION_RULES, validationRules }),

  loadTariffs: groupId => ({ type: constants.LOAD_TARIFFS, groupId }),
  loadingTariffs: () => ({ type: constants.LOADING_TARIFFS }),
  loadedTariffs: () => ({ type: constants.LOADED_TARIFFS }),
  setTariffs: ({ tariffs, gapTariffs }) => ({ type: constants.SET_TARIFFS, tariffs, gapTariffs }),

  addTariff: ({ resolve, reject, params, groupId }) => ({
    type: constants.ADD_TARIFF,
    resolve,
    reject,
    params,
    groupId,
  }),

  setGapTariffs: ({ resolve, reject, params, groupId }) => ({
    type: constants.SET_GAP_TARIFFS,
    resolve,
    reject,
    params,
    groupId,
  }),
};

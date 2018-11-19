export const constants = {
  SET_API_PARAMS: 'buzzn_registers/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_registers/SET_TOKEN',

  SET_VALIDATION_RULES: 'buzzn_registers/SET_VALIDATION_RULES',

  LOAD_REGISTER: 'buzzn_registers/LOAD_REGISTER',
  LOADING_REGISTER: 'buzzn_registers/LOADING_REGISTER',
  LOADED_REGISTER: 'buzzn_registers/LOADED_REGISTER',
  SET_REGISTER: 'buzzn_registers/SET_REGISTER',

  LOAD_REGISTER_POWER: 'buzzn_registers/LOAD_REGISTER_POWER',
  SET_REGISTER_POWER: 'buzzn_registers/SET_REGISTER_POWER',

  UPDATE_REGISTER: 'buzzn_registers/UPDATE_REGISTER',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setValidationRules: validationRules => ({ type: constants.SET_VALIDATION_RULES, validationRules }),

  loadRegister: ({ registerId, groupId, meterId }) => ({ type: constants.LOAD_REGISTER, registerId, groupId, meterId }),
  loadingRegister: () => ({ type: constants.LOADING_REGISTER }),
  loadedRegister: () => ({ type: constants.LOADED_REGISTER }),
  setRegister: register => ({ type: constants.SET_REGISTER, register }),

  loadRegisterPower: ({ registerId, groupId, meterId }) => ({ type: constants.LOAD_REGISTER_POWER, registerId, groupId, meterId }),
  setRegisterPower: ({ power }) => ({ type: constants.SET_REGISTER_POWER, power }),

  updateRegister: ({ registerId, params, resolve, reject, groupId }) => (
    { type: constants.UPDATE_REGISTER, registerId, params, resolve, reject, groupId }),
};

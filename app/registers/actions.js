export const constants = {
  SET_API_PARAMS: 'buzzn_registers/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_registers/SET_TOKEN',

  LOAD_REGISTER: 'buzzn_registers/LOAD_REGISTER',
  LOADING_REGISTER: 'buzzn_registers/LOADING_REGISTER',
  LOADED_REGISTER: 'buzzn_registers/LOADED_REGISTER',
  SET_REGISTER: 'buzzn_registers/SET_REGISTER',

  LOAD_REGISTERS: 'buzzn_registers/LOAD_REGISTERS',
  LOADING_REGISTERS: 'buzzn_registers/LOADING_REGISTERS',
  LOADED_REGISTERS: 'buzzn_registers/LOADED_REGISTERS',
  SET_REGISTERS: 'buzzn_registers/SET_REGISTERS',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  loadRegister: ({ registerId, groupId }) => ({ type: constants.LOAD_REGISTER, registerId, groupId }),
  loadingRegister: () => ({ type: constants.LOADING_REGISTER }),
  loadedRegister: () => ({ type: constants.LOADED_REGISTER }),
  setRegister: ({ register, readings }) => ({ type: constants.SET_REGISTER, register, readings }),

  loadRegisters: ({ groupId }) => ({ type: constants.LOAD_REGISTERS, groupId }),
  loadingRegisters: () => ({ type: constants.LOADING_REGISTERS }),
  loadedRegisters: () => ({ type: constants.LOADED_REGISTERS }),
  setRegisters: registers => ({ type: constants.SET_REGISTERS, registers }),
};

export const constants = {
  SET_API_PARAMS: 'buzzn_registers/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_registers/SET_TOKEN',

  LOAD_REGISTERS: 'buzzn_registers/LOAD_REGISTERS',
  LOADING_REGISTERS: 'buzzn_registers/LOADING_REGISTERS',
  LOADED_REGISTERS: 'buzzn_registers/LOADED_REGISTERS',
  SET_REGISTERS: 'buzzn_registers/SET_REGISTERS',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  loadRegisters: ({ meterId, meterType, groupId }) => ({ type: constants.LOAD_REGISTERS, meterId, meterType, groupId }),
  loadingRegisters: () => ({ type: constants.LOADING_REGISTERS }),
  loadedRegisters: () => ({ type: constants.LOADED_REGISTERS }),
  setRegisters: registers => ({ type: constants.SET_REGISTERS, registers }),
};

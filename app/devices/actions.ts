export const constants = {
  SET_API_PARAMS: 'buzzn_devices/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_devices/SET_TOKEN',

  SET_VALIDATION_RULES: 'buzzn_devices/SET_VALIDATION_RULES',

  LOAD_DEVICES: 'buzzn_devices/LOAD_DEVICES',
  LOADING_DEVICES: 'buzzn_devices/LOADING_DEVICES',
  LOADED_DEVICES: 'buzzn_devices/LOADED_DEVICES',
  SET_DEVICES: 'buzzn_devices/SET_DEVICES',

  LOAD_DEVICE: 'buzzn_devices/LOAD_DEVICE',
  LOADING_DEVICE: 'buzzn_devices/LOADING_DEVICE',
  LOADED_DEVICE: 'buzzn_devices/LOADED_DEVICE',
  SET_DEVICE: 'buzzn_devices/SET_DEVICE',

  ADD_DEVICE: 'buzzn_devices/ADD_DEVICE',
  UPDATE_DEVICE: 'buzzn_devices/UPDATE_DEVICE',
  DELETE_DEVICE: 'buzzn_devices/DELETE_DEVICE',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setValidationRules: (ruleType, validationRules) => ({
    type: constants.SET_VALIDATION_RULES,
    validationRules,
    ruleType,
  }),

  loadDevices: groupId => ({ type: constants.LOAD_DEVICES, groupId }),
  loadingDevices: () => ({ type: constants.LOADING_DEVICES }),
  loadedDevices: () => ({ type: constants.LOADED_DEVICES }),
  setDevices: devices => ({ type: constants.SET_DEVICES, devices }),

  loadDevice: ({ groupId, deviceId }) => ({ type: constants.LOAD_DEVICE, groupId, deviceId }),
  loadingDevice: () => ({ type: constants.LOADING_DEVICE }),
  loadedDevice: () => ({ type: constants.LOADED_DEVICE }),
  setDevice: device => ({ type: constants.SET_DEVICE, device }),

  addDevice: ({ params, resolve, reject, groupId }) => ({
    type: constants.ADD_DEVICE,
    params,
    resolve,
    reject,
    groupId,
  }),
  updateDevice: ({ params, resolve, reject, groupId, deviceId }) => ({
    type: constants.UPDATE_DEVICE,
    params,
    resolve,
    reject,
    groupId,
    deviceId,
  }),
  deleteDevice: ({ groupId, deviceId }) => ({
    type: constants.DELETE_DEVICE,
    groupId,
    deviceId,
  }),
};

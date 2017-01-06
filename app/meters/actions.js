export const constants = {
  SET_API_PARAMS: 'buzzn_meters/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_meters/SET_TOKEN',

  LOAD_METER: 'buzzn_meters/LOAD_METER',
  LOADING_METER: 'buzzn_meters/LOADING_METER',
  LOADED_METER: 'buzzn_meters/LOADED_METER',
  SET_METER: 'buzzn_meters/SET_METER',

  LOAD_METER_METERS: 'buzzn_meters/LOAD_METER_METERS',
  LOADING_METER_METERS: 'buzzn_meters/LOADING_METER_METERS',
  LOADED_METER_METERS: 'buzzn_meters/LOADED_METER_METERS',
  SET_METER_METERS: 'buzzn_meters/SET_METER_METERS',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  loadMeter: meterId => ({ type: constants.LOAD_METER, meterId }),
  loadingMeter: () => ({ type: constants.LOADING_METER }),
  loadedMeter: () => ({ type: constants.LOADED_METER }),
  setMeter: meter => ({ type: constants.SET_METER, meter }),

  loadUserMeters: ({ userId }) => ({ type: constants.LOAD_METER_METERS, userId }),
  loadingUserMeters: () => ({ type: constants.LOADING_METER_METERS }),
  loadedUserMeters: () => ({ type: constants.LOADED_METER_METERS }),
  setUserMeters: userMeters => ({ type: constants.SET_METER_METERS, userMeters }),
};

export const constants = {
  SET_API_PARAMS: 'buzzn_readings/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_readings/SET_TOKEN',

  SET_VALIDATION_RULES: 'buzzn_readings/SET_VALIDATION_RULES',

  ADD_READING: 'buzzn_readings/ADD_READING',
  DELETE_READING: 'buzzn_readings/DELETE_READING',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setValidationRules: validationRules => ({ type: constants.SET_VALIDATION_RULES, validationRules }),

  addReading: ({ meterId, registerId, params, resolve, reject, groupId }) => (
    { type: constants.ADD_READING, meterId, registerId, params, resolve, reject, groupId }),
  deleteReading: ({ meterId, registerId, groupId, readingId }) => (
    { type: constants.DELETE_READING, meterId, registerId, readingId, groupId }),
};

export const constants = {
  SET_API_PARAMS: 'buzzn_meters/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_meters/SET_TOKEN',

  SET_REAL_VALIDATION_RULES: 'buzzn_meters/SET_REAL_VALIDATION_RULES',
  SET_VIRTUAL_VALIDATION_RULES: 'buzzn_meters/SET_VIRTUAL_VALIDATION_RULES',

  LOAD_METER: 'buzzn_meters/LOAD_METER',
  LOADING_METER: 'buzzn_meters/LOADING_METER',
  LOADED_METER: 'buzzn_meters/LOADED_METER',
  SET_METER: 'buzzn_meters/SET_METER',

  UPDATE_METER: 'buzzn_meters/UPDATE_METER',
  UPDATE_FORMULA_PART: 'buzzn_meters/UPDATE_FORMULA_PART',

  LOAD_GROUP_METERS: 'buzzn_meters/LOAD_GROUP_METERS',
  LOADING_GROUP_METERS: 'buzzn_meters/LOADING_GROUP_METERS',
  LOADED_GROUP_METERS: 'buzzn_meters/LOADED_GROUP_METERS',
  SET_GROUP_METERS: 'buzzn_meters/SET_GROUP_METERS',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setRealValidationRules: realValidationRules => ({ type: constants.SET_REAL_VALIDATION_RULES, realValidationRules }),
  setVirtualValidationRules: virtualValidationRules => ({ type: constants.SET_VIRTUAL_VALIDATION_RULES, virtualValidationRules }),

  loadMeter: ({ meterId, groupId }) => ({ type: constants.LOAD_METER, meterId, groupId }),
  loadingMeter: () => ({ type: constants.LOADING_METER }),
  loadedMeter: () => ({ type: constants.LOADED_METER }),
  setMeter: meter => ({ type: constants.SET_METER, meter }),

  updateMeter: ({ meterId, params, resolve, reject, groupId }) => (
    { type: constants.UPDATE_METER, meterId, params, resolve, reject, groupId }),
  updateFormulaPart: ({ meterId, params, resolve, reject, groupId, formulaPartId }) => (
    { type: constants.UPDATE_FORMULA_PART, meterId, params, resolve, reject, groupId, formulaPartId }),

  loadGroupMeters: groupId => ({ type: constants.LOAD_GROUP_METERS, groupId }),
  loadingGroupMeters: () => ({ type: constants.LOADING_GROUP_METERS }),
  loadedGroupMeters: () => ({ type: constants.LOADED_GROUP_METERS }),
  setGroupMeters: groupMeters => ({ type: constants.SET_GROUP_METERS, groupMeters }),
};

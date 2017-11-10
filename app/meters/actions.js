// @flow
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

export type SetApiParams = {| type: 'buzzn_meters/SET_API_PARAMS', apiPath: string, apiUrl: string |};
export type SetToken = {| type: 'buzzn_meters/SET_TOKEN', token: string |};

export type SetRealValidationRules = {| type: 'buzzn_meters/SET_REAL_VALIDATION_RULES', realValidationRules: Object |};
export type SetVirtualValidationRules = {| type: 'buzzn_meters/SET_VIRTUAL_VALIDATION_RULES', virtualValidationRules: Object |};

export type LoadMeter = {| type: 'buzzn_meters/LOAD_METER', groupId: string, meterId: string |};
export type LoadingMeter = { type: 'buzzn_meters/LOADING_METER' };
export type LoadedMeter = {| type: 'buzzn_meters/LOADED_METER' |};
export type SetMeter = {| type: 'buzzn_meters/SET_METER', meter: Object |};

export type UpdateMeter = {|
  type: 'buzzn_meters/UPDATE_METER',
  params: Object,
  resolve: Promise.resolve<*>,
  reject: Promise.reject<*>,
  groupId: string,
  meterId: string,
|};
export type UpdateFormulaPart = {|
  type: 'buzzn_meters/UPDATE_FORMULA_PART',
  params: Object,
  resolve: Promise.resolve<*>,
  reject: Promise.reject<*>,
  groupId: string,
  meterId: string,
  formulaPartId: string,
|};

export type LoadGroupMeters = {| type: 'buzzn_meters/LOAD_GROUP_METERS', groupId: string |};
export type LoadingGroupMeters = {| type: 'buzzn_meters/LOADING_GROUP_METERS' |};
export type LoadedGroupMeters = {| type: 'buzzn_meters/LOADED_GROUP_METERS' |};
export type SetGroupMeters = {| type: 'buzzn_meters/SET_GROUP_METERS', groupMeters: { _status: null | number, array?: Array<Object> } |};

export type MetersAction =
  SetApiParams |
  SetToken |
  SetRealValidationRules |
  SetVirtualValidationRules |
  LoadMeter |
  LoadingMeter |
  LoadedMeter |
  SetMeter |
  UpdateMeter |
  UpdateFormulaPart |
  LoadGroupMeters |
  LoadingGroupMeters |
  LoadedGroupMeters |
  SetGroupMeters;

export const actions = {
  setApiParams: ({ apiPath, apiUrl }: { apiPath: string, apiUrl: string }): SetApiParams => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: (token: string): SetToken => ({ type: constants.SET_TOKEN, token }),

  setRealValidationRules: (realValidationRules: Object): SetRealValidationRules => ({ type: constants.SET_REAL_VALIDATION_RULES, realValidationRules }),
  setVirtualValidationRules: (virtualValidationRules: Object): SetVirtualValidationRules => ({ type: constants.SET_VIRTUAL_VALIDATION_RULES, virtualValidationRules }),

  loadMeter: ({ meterId, groupId }: { meterId: string, groupId: string }): LoadMeter => ({ type: constants.LOAD_METER, meterId, groupId }),
  loadingMeter: (): LoadingMeter => ({ type: constants.LOADING_METER }),
  loadedMeter: (): LoadedMeter => ({ type: constants.LOADED_METER }),
  setMeter: (meter: Object): SetMeter => ({ type: constants.SET_METER, meter }),

  updateMeter: ({ meterId, params, resolve, reject, groupId }:
    { meterId: string, params: Object, resolve: Promise.resolve<*>, reject: Promise.reject<*>, groupId: string }): UpdateMeter => (
    { type: constants.UPDATE_METER, meterId, params, resolve, reject, groupId }),
  updateFormulaPart: ({ meterId, params, resolve, reject, groupId, formulaPartId }:
    { meterId: string, params: Object, resolve: Promise.resolve<*>, reject: Promise.reject<*>, groupId: string, formulaPartId: string }): UpdateFormulaPart => (
    { type: constants.UPDATE_FORMULA_PART, meterId, params, resolve, reject, groupId, formulaPartId }),

  loadGroupMeters: (groupId: string): LoadGroupMeters => ({ type: constants.LOAD_GROUP_METERS, groupId }),
  loadingGroupMeters: (): LoadingGroupMeters => ({ type: constants.LOADING_GROUP_METERS }),
  loadedGroupMeters: (): LoadedGroupMeters => ({ type: constants.LOADED_GROUP_METERS }),
  setGroupMeters: (groupMeters: { _status: null | number, array?: Array<Object> }): SetGroupMeters => ({ type: constants.SET_GROUP_METERS, groupMeters }),
};

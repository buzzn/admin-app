export const constants = {
  SET_API_PARAMS: 'buzzn_groups/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_groups/SET_TOKEN',

  SET_VALIDATION_RULES: 'buzzn_groups/SET_VALIDATION_RULES',

  LOAD_GROUP: 'buzzn_groups/LOAD_GROUP',
  LOADING_GROUP: 'buzzn_groups/LOADING_GROUP',
  LOADED_GROUP: 'buzzn_groups/LOADED_GROUP',
  SET_GROUP: 'buzzn_groups/SET_GROUP',

  ADD_GROUP: 'buzzn_groups/ADD_GROUP',
  UPDATE_GROUP: 'buzzn_groups/UPDATE_GROUP',
  DELETE_GROUP: 'buzzn_groups/DELETE_GROUP',

  ADD_READINGS: 'buzzn_groups/ADD_READINGS',
  ADDING_READINGS: 'buzzn_groups/ADDING_READINGS',
  ADDED_READINGS: 'buzzn_groups/ADDED_READINGS',
  READINGS_RESPONSE: 'buzzn_groups/READINGS_RESPONSE',

  UPDATE_CONTACT: 'buzzn_groups/UPDATE_CONTACT',
  DELETE_CONTACT: 'buzzn_groups/DELETE_CONTACT',

  LOAD_GROUPS: 'buzzn_groups/LOAD_GROUPS',
  LOADING_GROUPS: 'buzzn_groups/LOADING_GROUPS',
  LOADED_GROUPS: 'buzzn_groups/LOADED_GROUPS',
  SET_GROUPS: 'buzzn_groups/SET_GROUPS',

  SEND_TESTMAIL: 'buzzn_groups/SEND_TESTMAIL',

  GET_ANNUAL_READINGS_TABLE: 'buzzn_groups/GET_ANNUAL_READINGS_TABLE',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setValidationRules: (ruleType, validationRules) => ({
    type: constants.SET_VALIDATION_RULES,
    ruleType,
    validationRules,
  }),

  loadGroup: groupId => ({ type: constants.LOAD_GROUP, groupId }),
  loadingGroup: () => ({ type: constants.LOADING_GROUP }),
  loadedGroup: () => ({ type: constants.LOADED_GROUP }),
  setGroup: group => ({ type: constants.SET_GROUP, group }),

  addGroup: ({ params, resolve, reject }) => ({
    type: constants.ADD_GROUP,
    params,
    resolve,
    reject,
  }),

  updateGroup: ({ params, resolve, reject, groupId }) => ({
    type: constants.UPDATE_GROUP,
    params,
    resolve,
    reject,
    groupId,
  }),

  addReadings: ({ params, resolve, reject, groupId }) => ({
    type: constants.ADD_READINGS,
    params,
    resolve,
    reject,
    groupId,
  }),
  addingReadings: () => ({ type: constants.ADDING_READINGS }),
  addedReadings: () => ({ type: constants.ADDED_READINGS }),
  setReadingsResponse: response => ({ type: constants.READINGS_RESPONSE, readingsResponse: response}),

  deleteGroup: ({ groupId }) => ({
    type: constants.DELETE_GROUP,
    groupId,
  }),

  deleteGapContact: ({ groupId }) => ({
    type: constants.DELETE_CONTACT,
    groupId,
  }),

  updateGroupContact: ({ groupId, params, resolve, reject, update, contactId, contactType, isGap }) => ({
    type: constants.UPDATE_CONTACT,
    groupId,
    params,
    resolve,
    reject,
    update,
    contactId,
    contactType,
    isGap,
  }),

  sendTestMail: ({ groupId, resolve, reject }) => ({
    type: constants.SEND_TESTMAIL,
    groupId,
    resolve,
    reject,
  }),

  getAnnualReadingsTable: ({ groupId, resolve, reject }) => ({
    type: constants.GET_ANNUAL_READINGS_TABLE,
    groupId,
    resolve,
    reject,
  }),

  loadGroups: () => ({ type: constants.LOAD_GROUPS }),
  loadingGroups: () => ({ type: constants.LOADING_GROUPS }),
  loadedGroups: () => ({ type: constants.LOADED_GROUPS }),
  setGroups: groups => ({ type: constants.SET_GROUPS, groups }),
};

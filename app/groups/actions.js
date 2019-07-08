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

  UPDATE_CONTACT: 'buzzn_groups/UPDATE_CONTACT',

  LOAD_GROUPS: 'buzzn_groups/LOAD_GROUPS',
  LOADING_GROUPS: 'buzzn_groups/LOADING_GROUPS',
  LOADED_GROUPS: 'buzzn_groups/LOADED_GROUPS',
  SET_GROUPS: 'buzzn_groups/SET_GROUPS',
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

  deleteGroup: ({ groupId }) => ({
    type: constants.DELETE_GROUP,
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

  loadGroups: () => ({ type: constants.LOAD_GROUPS }),
  loadingGroups: () => ({ type: constants.LOADING_GROUPS }),
  loadedGroups: () => ({ type: constants.LOADED_GROUPS }),
  setGroups: groups => ({ type: constants.SET_GROUPS, groups }),
};

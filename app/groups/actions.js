export const constants = {
  SET_API_PARAMS: 'buzzn_groups/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_groups/SET_TOKEN',
  START_CONFIG: 'buzzn_groups/START_CONFIG',
  END_CONFIG: 'buzzn_groups/END_CONFIG',

  LOAD_GROUP: 'buzzn_groups/LOAD_GROUP',
  LOADING_GROUP: 'buzzn_groups/LOADING_GROUP',
  LOADED_GROUP: 'buzzn_groups/LOADED_GROUP',
  SET_GROUP: 'buzzn_groups/SET_GROUP',

  LOAD_GROUPS: 'buzzn_groups/LOAD_GROUPS',
  LOADING_GROUPS: 'buzzn_groups/LOADING_GROUPS',
  LOADED_GROUPS: 'buzzn_groups/LOADED_GROUPS',
  SET_GROUPS: 'buzzn_groups/SET_GROUPS',

  LOAD_USER_GROUPS: 'buzzn_groups/LOAD_USER_GROUPS',
  LOADING_USER_GROUPS: 'buzzn_groups/LOADING_USER_GROUPS',
  LOADED_USER_GROUPS: 'buzzn_groups/LOADED_USER_GROUPS',
  SET_USER_GROUPS: 'buzzn_groups/SET_USER_GROUPS',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),
  startConfig: () => ({ type: constants.START_CONFIG }),
  endConfig: () => ({ type: constants.END_CONFIG }),

  loadGroup: groupId => ({ type: constants.LOAD_GROUP, groupId }),
  loadingGroup: () => ({ type: constants.LOADING_GROUP }),
  loadedGroup: () => ({ type: constants.LOADED_GROUP }),
  setGroup: group => ({ type: constants.SET_GROUP, group }),

  loadGroups: () => ({ type: constants.LOAD_GROUPS }),
  loadingGroups: () => ({ type: constants.LOADING_GROUPS }),
  loadedGroups: () => ({ type: constants.LOADED_GROUPS }),
  setGroups: groups => ({ type: constants.SET_GROUPS, groups }),

  loadUserGroups: userId => ({ type: constants.LOAD_USER_GROUPS, userId }),
  loadingUserGroups: () => ({ type: constants.LOADING_USER_GROUPS }),
  loadedUserGroups: () => ({ type: constants.LOADED_USER_GROUPS }),
  setUserGroups: userGroups => ({ type: constants.SET_USER_GROUPS, userGroups }),
};

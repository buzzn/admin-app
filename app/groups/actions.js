export const constants = {
  SET_API_PARAMS: 'buzzn_groups/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_groups/SET_TOKEN',

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

  loadGroups: () => ({ type: constants.LOAD_GROUPS }),
  loadingGroups: () => ({ type: constants.LOADING_GROUPS }),
  loadedGroups: () => ({ type: constants.LOADED_GROUPS }),
  setGroups: groups => ({ type: constants.SET_GROUPS, groups }),

  loadUserGroups: ({ userId }) => ({ type: constants.LOAD_USER_GROUPS, userId }),
  loadingUserGroups: () => ({ type: constants.LOADING_USER_GROUPS }),
  loadedUserGroups: () => ({ type: constants.LOADED_USER_GROUPS }),
  setUserGroups: userGroups => ({ type: constants.SET_USER_GROUPS, userGroups }),
};

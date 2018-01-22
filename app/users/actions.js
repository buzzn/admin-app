export const constants = {
  SET_API_PARAMS: 'buzzn_users/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_users/SET_TOKEN',

  SET_USER_ID: 'buzzn_users/SET_USER_ID',

  LOAD_USER: 'buzzn_users/LOAD_USER',
  LOADING_USER: 'buzzn_users/LOADING_USER',
  LOADED_USER: 'buzzn_users/LOADED_USER',
  SET_USER: 'buzzn_users/SET_USER',

  LOAD_GROUP_USER: 'buzzn_users/LOAD_GROUP_USER',
  LOADING_GROUP_USER: 'buzzn_users/LOADING_GROUP_USER',
  LOADED_GROUP_USER: 'buzzn_users/LOADED_GROUP_USER',
  SET_GROUP_USER: 'buzzn_users/SET_GROUP_USER',

  LOAD_GROUP_USERS: 'buzzn_users/LOAD_GROUP_USERS',
  LOADING_GROUP_USERS: 'buzzn_users/LOADING_GROUP_USERS',
  LOADED_GROUP_USERS: 'buzzn_users/LOADED_GROUP_USERS',
  SET_GROUP_USERS: 'buzzn_users/SET_GROUP_USERS',

  LOAD_GROUP_MANAGERS: 'buzzn_users/LOAD_GROUP_MANAGERS',
  LOADING_GROUP_MANAGERS: 'buzzn_users/LOADING_GROUP_MANAGERS',
  LOADED_GROUP_MANAGERS: 'buzzn_users/LOADED_GROUP_MANAGERS',
  SET_GROUP_MANAGERS: 'buzzn_users/SET_GROUP_MANAGERS',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setUserId: userId => ({ type: constants.SET_USER_ID, userId }),

  loadUser: ({ userId }) => ({ type: constants.LOAD_USER, userId }),
  loadingUser: () => ({ type: constants.LOADING_USER }),
  loadedUser: () => ({ type: constants.LOADED_USER }),
  setUser: user => ({ type: constants.SET_USER, user }),

  loadGroupUser: ({ userId, groupId }) => ({ type: constants.LOAD_GROUP_USER, userId, groupId }),
  loadingGroupUser: () => ({ type: constants.LOADING_GROUP_USER }),
  loadedGroupUser: () => ({ type: constants.LOADED_GROUP_USER }),
  setGroupUser: user => ({ type: constants.SET_GROUP_USER, user }),

  loadGroupUsers: () => ({ type: constants.LOAD_GROUP_USERS }),
  loadingGroupUsers: () => ({ type: constants.LOADING_GROUP_USERS }),
  loadedGroupUsers: () => ({ type: constants.LOADED_GROUP_USERS }),
  setGroupUsers: users => ({ type: constants.SET_GROUP_USERS, users }),

  loadGroupManagers: groupId => ({ type: constants.LOAD_GROUP_MANAGERS, groupId }),
  loadingGroupManagers: () => ({ type: constants.LOADING_GROUP_MANAGERS }),
  loadedGroupManagers: () => ({ type: constants.LOADED_GROUP_MANAGERS }),
  setGroupManagers: managers => ({ type: constants.SET_GROUP_MANAGERS, managers }),
};

export const constants = {
  SET_API_PARAMS: 'buzzn_users/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_users/SET_TOKEN',

  SET_USER_ID: 'buzzn_users/SET_USER_ID',

  LOAD_USER: 'buzzn_users/LOAD_USER',
  LOADING_USER: 'buzzn_users/LOADING_USER',
  LOADED_USER: 'buzzn_users/LOADED_USER',
  SET_USER: 'buzzn_users/SET_USER',

  LOAD_USERS: 'buzzn_users/LOAD_USERS',
  LOADING_USERS: 'buzzn_users/LOADING_USERS',
  LOADED_USERS: 'buzzn_users/LOADED_USERS',
  SET_USERS: 'buzzn_users/SET_USERS',

  LOAD_GROUP_MEMBERS: 'buzzn_users/LOAD_GROUP_MEMBERS',
  LOADING_GROUP_MEMBERS: 'buzzn_users/LOADING_GROUP_MEMBERS',
  LOADED_GROUP_MEMBERS: 'buzzn_users/LOADED_GROUP_MEMBERS',
  SET_GROUP_MEMBERS: 'buzzn_users/SET_GROUP_MEMBERS',

  LOAD_GROUP_MANAGERS: 'buzzn_users/LOAD_GROUP_MANAGERS',
  LOADING_GROUP_MANAGERS: 'buzzn_users/LOADING_GROUP_MANAGERS',
  LOADED_GROUP_MANAGERS: 'buzzn_users/LOADED_GROUP_MANAGERS',
  SET_GROUP_MANAGERS: 'buzzn_users/SET_GROUP_MANAGERS',

  LOAD_GROUP_POWERTAKERS: 'buzzn_users/LOAD_GROUP_POWERTAKERS',
  LOADING_GROUP_POWERTAKERS: 'buzzn_users/LOADING_GROUP_POWERTAKERS',
  LOADED_GROUP_POWERTAKERS: 'buzzn_users/LOADED_GROUP_POWERTAKERS',
  SET_GROUP_POWERTAKERS: 'buzzn_users/SET_GROUP_POWERTAKERS',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setUserId: userId => ({ type: constants.SET_USER_ID, userId }),

  loadUser: userId => ({ type: constants.LOAD_USER, userId }),
  loadingUser: () => ({ type: constants.LOADING_USER }),
  loadedUser: () => ({ type: constants.LOADED_USER }),
  setUser: user => ({ type: constants.SET_USER, user }),

  loadUsers: () => ({ type: constants.LOAD_USERS }),
  loadingUsers: () => ({ type: constants.LOADING_USERS }),
  loadedUsers: () => ({ type: constants.LOADED_USERS }),
  setUsers: users => ({ type: constants.SET_USERS, users }),

  loadGroupMembers: groupId => ({ type: constants.LOAD_GROUP_MEMBERS, groupId }),
  loadingGroupMembers: () => ({ type: constants.LOADING_GROUP_MEMBERS }),
  loadedGroupMembers: () => ({ type: constants.LOADED_GROUP_MEMBERS }),
  setGroupMembers: members => ({ type: constants.SET_GROUP_MEMBERS, members }),

  loadGroupManagers: groupId => ({ type: constants.LOAD_GROUP_MANAGERS, groupId }),
  loadingGroupManagers: () => ({ type: constants.LOADING_GROUP_MANAGERS }),
  loadedGroupManagers: () => ({ type: constants.LOADED_GROUP_MANAGERS }),
  setGroupManagers: managers => ({ type: constants.SET_GROUP_MANAGERS, managers }),

  loadGroupPowertakers: groupId => ({ type: constants.LOAD_GROUP_POWERTAKERS, groupId }),
  loadingGroupPowertakers: () => ({ type: constants.LOADING_GROUP_POWERTAKERS }),
  loadedGroupPowertakers: () => ({ type: constants.LOADED_GROUP_POWERTAKERS }),
  setGroupPowertakers: powertakers => ({ type: constants.SET_GROUP_POWERTAKERS, powertakers }),
};
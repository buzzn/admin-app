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
};

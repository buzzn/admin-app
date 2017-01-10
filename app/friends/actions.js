export const constants = {
  SET_API_PARAMS: 'buzzn_friends/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_friends/SET_TOKEN',

  LOAD_FRIENDS: 'buzzn_friends/LOAD_FRIENDS',
  LOADING_FRIENDS: 'buzzn_friends/LOADING_FRIENDS',
  LOADED_FRIENDS: 'buzzn_friends/LOADED_FRIENDS',
  SET_FRIENDS: 'buzzn_friends/SET_FRIENDS',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  loadFriends: userId => ({ type: constants.LOAD_FRIENDS, userId }),
  loadingFriends: () => ({ type: constants.LOADING_FRIENDS }),
  loadedFriends: () => ({ type: constants.LOADED_FRIENDS }),
  setFriends: friends => ({ type: constants.SET_FRIENDS, friends }),

};

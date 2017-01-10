export const constants = {
  SET_API_PARAMS: 'buzzn_profiles/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_profiles/SET_TOKEN',

  LOAD_PROFILE: 'buzzn_profiles/LOAD_PROFILE',
  LOADING_PROFILE: 'buzzn_profiles/LOADING_PROFILE',
  FAILED_PROFILE: 'buzzn_profiles/FAILED_PROFILE',
  SET_PROFILE: 'buzzn_profiles/SET_PROFILE',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  loadProfile: userId => ({ type: constants.LOAD_PROFILE, userId }),
  loadingProfile: userId => ({ type: constants.LOADING_PROFILE, userId }),
  setProfile: ({ userId, profile }) => ({ type: constants.SET_PROFILE, userId, profile }),
  failedProfile: userId => ({ type: constants.FAILED_PROFILE, userId }),
};

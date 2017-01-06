export const constants = {
  SET_API_PARAMS: 'buzzn_profiles/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_profiles/SET_TOKEN',

  LOAD_PROFILE: 'buzzn_profiles/LOAD_PROFILE',
  LOADING_PROFILE: 'buzzn_profiles/LOADING_PROFILE',
  LOADED_PROFILE: 'buzzn_profiles/LOADED_PROFILE',
  SET_PROFILE: 'buzzn_profiles/SET_PROFILE',

  LOAD_PROFILES: 'buzzn_profiles/LOAD_PROFILES',
  LOADING_PROFILES: 'buzzn_profiles/LOADING_PROFILES',
  LOADED_PROFILES: 'buzzn_profiles/LOADED_PROFILES',
  SET_PROFILES: 'buzzn_profiles/SET_PROFILES',

  LOAD_PROFILE_PROFILES: 'buzzn_profiles/LOAD_PROFILE_PROFILES',
  LOADING_PROFILE_PROFILES: 'buzzn_profiles/LOADING_PROFILE_PROFILES',
  LOADED_PROFILE_PROFILES: 'buzzn_profiles/LOADED_PROFILE_PROFILES',
  SET_PROFILE_PROFILES: 'buzzn_profiles/SET_PROFILE_PROFILES',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  loadProfile: profileId => ({ type: constants.LOAD_PROFILE, profileId }),
  loadingProfile: () => ({ type: constants.LOADING_PROFILE }),
  loadedProfile: () => ({ type: constants.LOADED_PROFILE }),
  setProfile: profile => ({ type: constants.SET_PROFILE, profile }),

  loadProfiles: () => ({ type: constants.LOAD_PROFILES }),
  loadingProfiles: () => ({ type: constants.LOADING_PROFILES }),
  loadedProfiles: () => ({ type: constants.LOADED_PROFILES }),
  setProfiles: profiles => ({ type: constants.SET_PROFILES, profiles }),

  loadUserProfiles: ({ userId }) => ({ type: constants.LOAD_PROFILE_PROFILES, userId }),
  loadingUserProfiles: () => ({ type: constants.LOADING_PROFILE_PROFILES }),
  loadedUserProfiles: () => ({ type: constants.LOADED_PROFILE_PROFILES }),
  setUserProfiles: userProfiles => ({ type: constants.SET_PROFILE_PROFILES, userProfiles }),
};

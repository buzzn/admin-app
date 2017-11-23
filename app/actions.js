export const constants = {
  LOADING: 'buzzn_admin/LOADING',
  LOADED: 'buzzn_admin/LOADED',

  LOAD_USER_ME: 'buzzn_admin/LOAD_USER_ME',
  SET_USER_ME: 'buzzn_admin/SET_USER_ME',
  SET_USER_ME_VALIDATION_RULES: 'buzzn_admin/SET_USER_ME_VALIDATION_RULES',
  UPDATE_USER_ME: 'buzzn_admin/UPDATE_USER_ME',

  SET_HEALTH: 'buzzn_admin/SET_HEALTH',

  SET_DEV_MODE: 'buzzn_admin/SET_DEV_MODE',

  SET_INCOMPLETE_SCREEN: 'buzzn_admin/SET_INCOMPLETE_SCREEN',
};

export const actions = {
  loadUserMe: () => ({ type: constants.LOAD_USER_ME }),
  setUserMe: userMe => ({ type: constants.SET_USER_ME, userMe }),
  setUserMeValidationRules: userMeValidationRules => (
    { type: constants.SET_USER_ME_VALIDATION_RULES, userMeValidationRules }),
  updateUserMe: ({ params, resolve, reject }) => (
    { type: constants.UPDATE_USER_ME, params, resolve, reject }),

  setHealth: health => ({ type: constants.SET_HEALTH, health }),

  setDevMode: mode => ({ type: constants.SET_DEV_MODE, mode }),

  setIncompleteScreen: incompleteScreen => ({ type: constants.SET_INCOMPLETE_SCREEN, incompleteScreen }),
};

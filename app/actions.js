export const constants = {
  LOADING: 'buzzn_admin/LOADING',
  LOADED: 'buzzn_admin/LOADED',

  LOAD_USER_ME: 'buzzn_admin/LOAD_USER_ME',
  SET_USER_ME: 'buzzn_admin/SET_USER_ME',
  SET_USER_ME_VALIDATION_RULES: 'buzzn_admin/SET_USER_ME_VALIDATION_RULES',
  UPDATE_USER_ME: 'buzzn_admin/UPDATE_USER_ME',

  SET_HEALTH: 'buzzn_admin/SET_HEALTH',

  SET_APP_LOADING: 'buzzn_admin/SET_APP_LOADING',

  SET_VERSION_MISMATCH: 'buzzn_admin/SET_VERSION_MISMATCH',

  SET_UI: 'buzzn_admin/SET_UI',
  SET_TABLE_SORT: 'buzzn_admin/SET_TABLE_SORT',

  SET_INCOMPLETE_SCREEN: 'buzzn_admin/SET_INCOMPLETE_SCREEN',
};

export const actions = {
  loadUserMe: () => ({ type: constants.LOAD_USER_ME }),
  setUserMe: userMe => ({ type: constants.SET_USER_ME, userMe }),
  setUserMeValidationRules: userMeValidationRules => ({
    type: constants.SET_USER_ME_VALIDATION_RULES,
    userMeValidationRules,
  }),
  updateUserMe: ({ params, resolve, reject }) => ({ type: constants.UPDATE_USER_ME, params, resolve, reject }),

  setHealth: health => ({ type: constants.SET_HEALTH, health }),

  setAppLoading: appLoading => ({ type: constants.SET_APP_LOADING, appLoading }),

  setVersionMismatch: versionMismatch => ({ type: constants.SET_VERSION_MISMATCH, versionMismatch }),

  setUI: ui => ({ type: constants.SET_UI, ui }),
  setTableSort: ({ table, sort }) => ({ type: constants.SET_TABLE_SORT, table, sort }),

  setIncompleteScreen: incompleteScreen => ({ type: constants.SET_INCOMPLETE_SCREEN, incompleteScreen }),
};

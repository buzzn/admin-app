export const constants = {
  LOADING: 'buzzn_admin/LOADING',
  LOADED: 'buzzn_admin/LOADED',

  SET_USER_ME: 'buzzn_admin/SET_USER_ME',
};

export const actions = {
  setUserMe: userMe => ({ type: constants.SET_USER_ME, userMe }),
};

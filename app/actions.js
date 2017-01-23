export const constants = {
  LOADING:          'buzzn_profile/LOADING',
  LOADED:           'buzzn_profile/LOADED',

  SET_USER_ME:      'buzzn_profile/SET_USER_ME',
};

export const actions = {
  setUserMe: userMe => ({ type: constants.SET_USER_ME, userMe }),
};

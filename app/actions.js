export const constants = {
  LOADING:          'buzzn_profile/LOADING',
  LOADED:           'buzzn_profile/LOADED',

  SET_USER_ME:      'buzzn_profile/SET_USER_ME',
  SET_USER_ID:      'buzzn_profile/SET_USER_ID',
  SET_USER_PROFILE: 'buzzn_profile/SET_USER_PROFILE',
  SET_USER_FRIENDS: 'buzzn_profile/SET_USER_FRIENDS',
};

export const actions = {
  setUserId: userId => ({ type: constants.SET_USER_ID, userId }),
  setUserMe: userMe => ({ type: constants.SET_USER_ME, userMe }),
  setUserProfile: userProfile => ({ type: constants.SET_USER_PROFILE, userProfile }),
  setUserFriends: userFriends => ({ type: constants.SET_USER_FRIENDS, userFriends }),
};

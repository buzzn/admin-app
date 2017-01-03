export const constants = {
  LOADING:          'buzzn_profile/LOADING',
  LOADED:           'buzzn_profile/LOADED',

  SET_GROUPS:       'buzzn_profile/SET_GROUPS',

  SET_USER_ME:      'buzzn_profile/SET_USER_ME',
  SET_USER_ID:      'buzzn_profile/SET_USER_ID',
  SET_USER_PROFILE: 'buzzn_profile/SET_USER_PROFILE',
  SET_USER_FRIENDS: 'buzzn_profile/SET_USER_FRIENDS',
  SET_USER_GROUPS:  'buzzn_profile/SET_USER_GROUPS',
};

export const actions = {
  loading: () => ({ type: constants.LOADING }),
  loaded: () => ({ type: constants.LOADED }),

  setGroups: groups => ({ type: constants.SET_GROUPS, groups }),

  setUserId: userId => ({ type: constants.SET_USER_ID, userId }),
  setUserMe: userMe => ({ type: constants.SET_USER_ME, userMe }),
  setUserProfile: userProfile => ({ type: constants.SET_USER_PROFILE, userProfile }),
  setUserFriends: userFriends => ({ type: constants.SET_USER_FRIENDS, userFriends }),
  setUserGroups: userGroups => ({ type: constants.SET_USER_GROUPS, userGroups }),
};

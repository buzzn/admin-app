export const constants = {
  LOADING:          'buzzn_profile/LOADING',
  LOADED:           'buzzn_profile/LOADED',

  SET_GROUPS:       'buzzn_profile/SET_GROUPS',

  SET_MY_ID:        'buzzn_profile/SET_MY_ID',
  SET_USER_ID:      'buzzn_profile/SET_USER_ID',
  SET_PROFILE:      'buzzn_profile/SET_PROFILE',
  SET_USER_FRIENDS: 'buzzn_profile/SET_USER_FRIENDS',
  SET_USER_GROUPS:  'buzzn_profile/SET_USER_GROUPS',
};

export const actions = {
  loading: () => ({ type: constants.LOADING }),
  loaded: () => ({ type: constants.LOADED }),

  setGroups: groups => ({ type: constants.SET_GROUPS, groups }),

  setMyId: myId => ({ type: constants.SET_MY_ID, myId }),
  setUserId: userId => ({ type: constants.SET_USER_ID, userId }),
  setProfile: profile => ({ type: constants.SET_PROFILE, profile }),
  setUserFriends: userFriends => ({ type: constants.SET_USER_FRIENDS, userFriends }),
  setUserGroups: userGroups => ({ type: constants.SET_USER_GROUPS, userGroups }),
};

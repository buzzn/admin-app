export const constants = {
  LOADING: 'buzzn_profileApp/LOADING',
  LOADED: 'buzzn_profileApp/LOADED',
  SET_MY_ID: 'buzzn_profileApp/SET_MY_ID',
  SET_USER_ID: 'buzzn_profileApp/SET_USER_ID',
  SET_PROFILE: 'buzzn_profileApp/SET_PROFILE',
  SET_FRIENDS: 'buzzn_profile/SET_FRIENDS',
  SET_GROUPS: 'buzzn_profile/SET_GROUPS',
};

export const actions = {
  loading: () => ({ type: constants.LOADING }),
  loaded: () => ({ type: constants.LOADED }),
  setMyId: myId => ({ type: constants.SET_MY_ID, myId }),
  setUserId: userId => ({ type: constants.SET_USER_ID, userId }),
  setProfile: profile => ({ type: constants.SET_PROFILE, profile }),
  setFriends: friends => ({ type: constants.SET_FRIENDS, friends }),
  setGroups: groups => ({ type: constants.SET_GROUPS, groups }),
};

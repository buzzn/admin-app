import { constants } from './actions';

export const initialState = {
  loadingUser: false,
  loadingUsers: false,
  loadingGroupMembers: false,
  loadingGroupManagers: false,
  loadingGroupPowertakers: false,
  user: {},
  users: [],
  groupMembers: [],
  groupManagers: [],
  groupPowertakers: [],
  userId: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_USER:
      return { ...state, userId: action.userId };
    case constants.LOADING_USER:
      return { ...state, loadingUser: true };
    case constants.LOADED_USER:
      return { ...state, loadingUser: false };
    case constants.SET_USER:
      return { ...state, user: action.user };

    case constants.LOADING_USERS:
      return { ...state, loadingUsers: true };
    case constants.LOADED_USERS:
      return { ...state, loadingUsers: false };
    case constants.SET_USERS:
      return { ...state, users: action.users };

    case constants.LOAD_GROUP_MEMBERS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_GROUP_MEMBERS:
      return { ...state, loadingGroupMembers: true };
    case constants.LOADED_GROUP_MEMBERS:
      return { ...state, loadingGroupMembers: false };
    case constants.SET_GROUP_MEMBERS:
      return { ...state, groupMembers: action.members };

    case constants.LOAD_GROUP_MANAGERS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_GROUP_MANAGERS:
      return { ...state, loadingGroupManagers: true };
    case constants.LOADED_GROUP_MANAGERS:
      return { ...state, loadingGroupManagers: false };
    case constants.SET_GROUP_MANAGERS:
      return { ...state, groupManagers: action.managers };

    case constants.LOAD_GROUP_POWERTAKERS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_GROUP_POWERTAKERS:
      return { ...state, loadingGroupPowertakers: true };
    case constants.LOADED_GROUP_POWERTAKERS:
      return { ...state, loadingGroupPowertakers: false };
    case constants.SET_GROUP_POWERTAKERS:
      return { ...state, groupPowertakers: action.powertakers };

    case constants.SET_USER_ID:
      return { ...state, userId: action.userId };

    default:
      return state;
  }
}

import { constants } from './actions';

export const initialState = {
  loadingUser: false,
  loadingGroupUsers: false,
  loadingGroupManagers: false,
  me: {},
  user: {},
  groupUsers: [],
  groupManagers: [],
  userId: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_USER:
      return { ...state, userId: action.userId, groupId: action.groupId };
    case constants.LOADING_USER:
      return { ...state, loadingUser: true };
    case constants.LOADED_USER:
      return { ...state, loadingUser: false };
    case constants.SET_USER:
      return { ...state, user: action.user };

    case constants.LOADING_GROUP_USERS:
      return { ...state, loadingGroupUsers: true };
    case constants.LOADED_GROUP_USERS:
      return { ...state, loadingGroupUsers: false };
    case constants.SET_GROUP_USERS:
      return { ...state, groupUsers: action.users };

    case constants.LOAD_GROUP_MANAGERS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_GROUP_MANAGERS:
      return { ...state, loadingGroupManagers: true };
    case constants.LOADED_GROUP_MANAGERS:
      return { ...state, loadingGroupManagers: false };
    case constants.SET_GROUP_MANAGERS:
      return { ...state, groupManagers: action.managers };

    case constants.SET_USER_ID:
      return { ...state, userId: action.userId };

    default:
      return state;
  }
}

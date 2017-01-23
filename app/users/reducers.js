import { constants } from './actions';

export const initialState = {
  loadingUser: false,
  loadingUsers: false,
  user: null,
  users: [],
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

    case constants.SET_USER_ID:
      return { ...state, userId: action.userId };

    default:
      return state;
  }
}

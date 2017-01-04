import { constants } from './actions';

export const initialState = {
  loadingGroups: false,
  loadingUserGroups: false,
  groups: [],
  userGroups: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOADING_GROUPS:
      return { ...state, loadingGroups: true };
    case constants.LOADED_GROUPS:
      return { ...state, loadingGroups: false };
    case constants.SET_GROUPS:
      return { ...state, groups: action.groups };
    case constants.LOADING_USER_GROUPS:
      return { ...state, loadingUserGroups: true };
    case constants.LOADED_USER_GROUPS:
      return { ...state, loadingUserGroups: false };
    case constants.SET_USER_GROUPS:
      return { ...state, userGroups: action.userGroups };
    default:
      return state;
  }
}

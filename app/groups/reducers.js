import { constants } from './actions';

export const initialState = {
  configured: false,
  loadingGroups: false,
  loadingUserGroups: false,
  loadingGroup: false,
  groups: [],
  group: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_GROUP:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_GROUP:
      return { ...state, loadingGroup: true };
    case constants.LOADED_GROUP:
      return { ...state, loadingGroup: false };
    case constants.SET_GROUP:
      return { ...state, group: action.group };

    case constants.LOADING_GROUPS:
      return { ...state, loadingGroups: true };
    case constants.LOADED_GROUPS:
      return { ...state, loadingGroups: false };
    case constants.SET_GROUPS:
      return { ...state, groups: action.groups };

    case constants.START_CONFIG:
      return { ...state, configured: false };
    case constants.END_CONFIG:
      return { ...state, configured: true };

    case constants.SET_TOKEN:
    default:
      return state;
  }
}

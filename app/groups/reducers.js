import { constants } from './actions';

export const initialState = {
  loadingGroups: false,
  loadingUserGroups: false,
  loadingGroup: false,
  loadingGroupComments: false,
  groups: { _status: null, array: [] },
  group: { _status: null },
  groupComments: { _status: null, array: [] },
  validationRules: {
    updateGroup: { _status: null },
    createOrganizationOwner: { _status: null },
    updateOrganizationOwner: { _status: null },
    createPersonOwner: { _status: null },
    updatePersonOwner: { _status: null },
    createCommment: { _status: null },
    updateCommment: { _status: null },
  },
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

    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: { ...state.validationRules, [action.ruleType]: action.validationRules } };

    case constants.LOADING_GROUPS:
      return { ...state, loadingGroups: true };
    case constants.LOADED_GROUPS:
      return { ...state, loadingGroups: false };
    case constants.SET_GROUPS:
      return { ...state, groups: action.groups };

    case constants.LOAD_GROUP_COMMENTS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_GROUP_COMMENTS:
      return { ...state, loadingGroupComments: true };
    case constants.LOADED_GROUP_COMMENTS:
      return { ...state, loadingGroupComments: false };
    case constants.SET_GROUP_COMMENTS:
      return { ...state, groupComments: action.comments };

    case constants.SET_TOKEN:
    default:
      return state;
  }
}

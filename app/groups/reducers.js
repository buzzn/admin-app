// @flow
import { constants } from './actions';
import type { GroupsAction } from './actions';

export const initialState = {
  loadingGroups: false,
  loadingGroupsStats: false,
  loadingUserGroups: false,
  loadingGroup: false,
  groups: { _status: null, array: [] },
  group: { _status: null },
  groupsStats: {},
  validationRules: { _status: null },
};

export type GroupStats = {
  solar: boolean,
  fire: boolean,
  water: boolean,
  wind: boolean,
  production: string,
  consumption: string,
  autarchy: void | string,
};

export type GroupsStats = {
  [id: string]: GroupStats,
};

export type GroupsState = {
  +loadingGroups: boolean,
  +loadingGroupsStats: boolean,
  +loadingUserGroups: boolean,
  +loadingGroup: boolean,
  +groups: { _status: null | number, array?: Array<Object> },
  +group: Object,
  +groupsStats: GroupsStats,
  +validationRules: Object,
};

export default function (state: GroupsState = initialState, action: GroupsAction): GroupsState {
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
      return { ...state, validationRules: action.validationRules };

    case constants.LOADING_GROUPS:
      return { ...state, loadingGroups: true };
    case constants.LOADED_GROUPS:
      return { ...state, loadingGroups: false };
    case constants.SET_GROUPS:
      return { ...state, groups: action.groups };

    case constants.LOADING_GROUPS_STATS:
      return { ...state, loadingGroupsStats: true };
    case constants.LOADED_GROUPS_STATS:
      return { ...state, loadingGroupsStats: false };
    case constants.SET_GROUPS_STATS:
      return { ...state, groupsStats: action.groupsStats };

    case constants.SET_TOKEN:
    default:
      return state;
  }
}

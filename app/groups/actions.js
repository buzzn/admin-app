// @flow
import { GroupsStats } from './reducers';

export const constants = {
  SET_API_PARAMS: 'buzzn_groups/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_groups/SET_TOKEN',

  SET_VALIDATION_RULES: 'buzzn_groups/SET_VALIDATION_RULES',

  LOAD_GROUP: 'buzzn_groups/LOAD_GROUP',
  LOADING_GROUP: 'buzzn_groups/LOADING_GROUP',
  LOADED_GROUP: 'buzzn_groups/LOADED_GROUP',
  SET_GROUP: 'buzzn_groups/SET_GROUP',

  UPDATE_GROUP: 'buzzn_groups/UPDATE_GROUP',

  LOAD_GROUPS: 'buzzn_groups/LOAD_GROUPS',
  LOADING_GROUPS: 'buzzn_groups/LOADING_GROUPS',
  LOADED_GROUPS: 'buzzn_groups/LOADED_GROUPS',
  SET_GROUPS: 'buzzn_groups/SET_GROUPS',

  LOAD_GROUPS_STATS: 'buzzn_groups/LOAD_GROUPS_STATS',
  LOADING_GROUPS_STATS: 'buzzn_groups/LOADING_GROUPS_STATS',
  LOADED_GROUPS_STATS: 'buzzn_groups/LOADED_GROUPS_STATS',
  SET_GROUPS_STATS: 'buzzn_groups/SET_GROUPS_STATS',
};

export type SetApiParams = {| type: 'buzzn_groups/SET_API_PARAMS', apiPath: string, apiUrl: string |};
export type SetToken = {| type: 'buzzn_groups/SET_TOKEN', token: string |};

export type SetValidationRules = {| type: 'buzzn_groups/SET_VALIDATION_RULES', validationRules: Object |};

export type LoadGroup = {| type: 'buzzn_groups/LOAD_GROUP', groupId: string |};
export type LoadingGroup = { type: 'buzzn_groups/LOADING_GROUP' };
export type LoadedGroup = {| type: 'buzzn_groups/LOADED_GROUP' |};
export type SetGroup = {| type: 'buzzn_groups/SET_GROUP', group: Object |};

export type UpdateGroup = {|
  type: 'buzzn_groups/UPDATE_GROUP',
  params: Object,
  resolve: Promise.resolve<*>,
  reject: Promise.reject<*>,
  groupId: string,
|};

export type LoadGroups = {| type: 'buzzn_groups/LOAD_GROUPS' |};
export type LoadingGroups = {| type: 'buzzn_groups/LOADING_GROUPS' |};
export type LoadedGroups = {| type: 'buzzn_groups/LOADED_GROUPS' |};
export type SetGroups = {| type: 'buzzn_groups/SET_GROUPS', groups: { status?: number, array?: Array<Object> } |};

export type LoadGroupsStats = {| type: 'buzzn_groups/LOAD_GROUPS_STATS' |};
export type LoadingGroupsStats = {| type: 'buzzn_groups/LOADING_GROUPS_STATS' |};
export type LoadedGroupsStats = {| type: 'buzzn_groups/LOADED_GROUPS_STATS' |};
export type SetGroupsStats = {| type: 'buzzn_groups/SET_GROUPS_STATS', groupsStats: GroupsStats |};

export type GroupsAction =
  SetApiParams |
  SetToken |
  SetValidationRules |
  LoadGroup |
  LoadingGroup |
  LoadedGroup |
  SetGroup |
  UpdateGroup |
  LoadGroups |
  LoadingGroups |
  LoadedGroups |
  SetGroups |
  LoadGroupsStats |
  LoadingGroupsStats |
  LoadedGroupsStats |
  SetGroupsStats;

export const actions = {
  setApiParams: ({ apiPath, apiUrl }: { apiPath: string, apiUrl: string }): SetApiParams => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: (token: string): SetToken => ({ type: constants.SET_TOKEN, token }),

  setValidationRules: (validationRules: Object): SetValidationRules => ({ type: constants.SET_VALIDATION_RULES, validationRules }),

  loadGroup: (groupId: string): LoadGroup => ({ type: constants.LOAD_GROUP, groupId }),
  loadingGroup: (): LoadingGroup => ({ type: constants.LOADING_GROUP }),
  loadedGroup: (): LoadedGroup => ({ type: constants.LOADED_GROUP }),
  setGroup: (group: Object): SetGroup => ({ type: constants.SET_GROUP, group }),

  updateGroup: ({ params, resolve, reject, groupId }:
    { params: Object, resolve: Promise.resolve<*>, reject: Promise.reject<*>, groupId: string }): UpdateGroup => (
    { type: constants.UPDATE_GROUP, params, resolve, reject, groupId }),

  loadGroups: (): LoadGroups => ({ type: constants.LOAD_GROUPS }),
  loadingGroups: (): LoadingGroups => ({ type: constants.LOADING_GROUPS }),
  loadedGroups: (): LoadedGroups => ({ type: constants.LOADED_GROUPS }),
  setGroups: (groups: { status?: number, array?: Array<Object> }): SetGroups => ({ type: constants.SET_GROUPS, groups }),

  loadGroupsStats: (): LoadGroupsStats => ({ type: constants.LOAD_GROUPS_STATS }),
  loadingGroupsStats: (): LoadingGroupsStats => ({ type: constants.LOADING_GROUPS_STATS }),
  loadedGroupsStats: (): LoadedGroupsStats => ({ type: constants.LOADED_GROUPS_STATS }),
  setGroupsStats: (groupsStats: GroupsStats): SetGroupsStats => ({ type: constants.SET_GROUPS_STATS, groupsStats }),
};

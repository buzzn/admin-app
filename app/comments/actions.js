export const constants = {
  SET_API_PARAMS: 'buzzn_comments/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_comments/SET_TOKEN',

  SET_VALIDATION_RULES: 'buzzn_comments/SET_VALIDATION_RULES',

  LOAD_COMMENTS: 'buzzn_comments/LOAD_COMMENTS',
  LOADING_COMMENTS: 'buzzn_comments/LOADING_COMMENTS',
  LOADED_COMMENTS: 'buzzn_comments/LOADED_COMMENTS',
  SET_COMMENTS: 'buzzn_comments/SET_COMMENTS',

  ADD_COMMENT: 'buzzn_comments/ADD_COMMENT',
  UPDATE_COMMENT: 'buzzn_comments/UPDATE_COMMENT',
  DELETE_COMMENT: 'buzzn_comments/DELETE_COMMENT',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setValidationRules: (ruleType, validationRules) => ({
    type: constants.SET_VALIDATION_RULES,
    ruleType,
    validationRules,
  }),
  loadComments: ids => ({ type: constants.LOAD_COMMENTS, ids }),
  loadingComments: () => ({ type: constants.LOADING_COMMENTS }),
  loadedComments: () => ({ type: constants.LOADED_COMMENTS }),
  setComments: comments => ({ type: constants.SET_COMMENTS, comments }),

  addComment: ({ params, resolve, reject, ids }) => ({
    type: constants.ADD_COMMENT,
    ids,
    params,
    resolve,
    reject,
  }),

  updateComment: ({ params, resolve, reject, ids }) => ({
    type: constants.UPDATE_COMMENT,
    ids,
    params,
    resolve,
    reject,
  }),

  deleteComment: ({ ids }) => ({
    type: constants.DELETE_COMMENT,
    ids,
  }),
};

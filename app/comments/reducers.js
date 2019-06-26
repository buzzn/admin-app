import { constants } from './actions';

export const initialState = {
  ids: {},
  loadingComments: false,
  comments: { _status: null, array: [] },
  validationRules: { createCommment: { _status: null }, updateCommment: { _status: null } },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: { ...state.validationRules, [action.ruleType]: action.validationRules } };

    case constants.LOAD_COMMENTS:
      return { ...state, ids: action.ids };
    case constants.LOADING_COMMENTS:
      return { ...state, loadingComments: true };
    case constants.LOADED_COMMENTS:
      return { ...state, loadingComments: false };
    case constants.SET_COMMENTS:
      return { ...state, comments: action.comments };

    case constants.SET_TOKEN:
    default:
      return state;
  }
}

import { constants } from './actions';

export default function(state = { validationRules: {} }, action) {
  switch (action.type) {
    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: action.validationRules };

    default:
      return state;
  }
}

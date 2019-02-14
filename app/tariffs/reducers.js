import { constants } from './actions';

export const initialState = {
  loadingTariffs: false,
  tariffs: { _status: null, array: [] },
  gapTariffs: { _status: null, array: [] },
  validationRules: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_TARIFFS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_TARIFFS:
      return { ...state, loadingTariffs: true };
    case constants.LOADED_TARIFFS:
      return { ...state, loadingTariffs: false };
    case constants.SET_TARIFFS:
      return { ...state, tariffs: action.tariffs, gapTariffs: action.gapTariffs };

    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: action.validationRules };

    default:
      return state;
  }
}

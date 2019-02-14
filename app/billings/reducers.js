import { constants } from './actions';

export const initialState = {
  loadingBillings: false,
  loadingBilling: false,
  billings: { _status: null, array: [] },
  billing: { _status: null },
  validationRules: {
    billingCreate: { _status: null },
    billingUpdate: { _status: null },
    readingAttach: { _status: null },
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: { ...state.validationRules, [action.ruleType]: action.validationRules } };

    case constants.LOAD_BILLING:
      return { ...state, billingId: action.billingId, groupId: action.groupId, contractId: action.contractId };
    case constants.LOADING_BILLING:
      return { ...state, loadingBilling: true };
    case constants.LOADED_BILLING:
      return { ...state, loadingBilling: false };
    case constants.SET_BILLING:
      return { ...state, billing: action.billing };

    case constants.LOAD_BILLINGS:
      return { ...state, groupId: action.groupId, contractId: action.contractId };
    case constants.LOADING_BILLINGS:
      return { ...state, loadingBillings: true };
    case constants.LOADED_BILLINGS:
      return { ...state, loadingBillings: false };
    case constants.SET_BILLINGS:
      return { ...state, billings: action.billings };

    default:
      return state;
  }
}

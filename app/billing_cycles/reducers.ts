import { constants } from './actions';

export const initialState = {
  loadingBillingCycles: false,
  loadingBillingCycle: false,
  loadingBilling: false,
  billingCycles: { _status: null, array: [] },
  billingCycle: { _status: null },
  billingCycleBars: { _status: null, array: [] },
  billing: { _status: null },
  validationRules: { _status: null },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: action.validationRules };

    case constants.LOAD_BILLING_CYCLE:
      return { ...state, billingCycleId: action.billingCycleId, groupId: action.groupId };
    case constants.LOADING_BILLING_CYCLE:
      return { ...state, loadingBillingCycle: true };
    case constants.LOADED_BILLING_CYCLE:
      return { ...state, loadingBillingCycle: false };
    case constants.SET_BILLING_CYCLE:
      return { ...state, billingCycle: action.billingCycle, billingCycleBars: action.billingCycleBars };

    case constants.LOAD_BILLING_CYCLES:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_BILLING_CYCLES:
      return { ...state, loadingBillingCycles: true };
    case constants.LOADED_BILLING_CYCLES:
      return { ...state, loadingBillingCycles: false };
    case constants.SET_BILLING_CYCLES:
      return { ...state, billingCycles: action.billingCycles };

    case constants.LOAD_BILLING:
      return { ...state, billingId: action.billingId, groupId: action.groupId, billingCycleId: action.billingCycleId };
    case constants.LOADING_BILLING:
      return { ...state, loadingBilling: true };
    case constants.LOADED_BILLING:
      return { ...state, loadingBilling: false };
    case constants.SET_BILLING:
      return { ...state, billing: action.billing };

    default:
      return state;
  }
}

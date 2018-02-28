import { constants } from './actions';

export const initialState = {
  loadingBillingCycles: false,
  loadingBillingCycle: false,
  billingCycles: { _status: null, array: [] },
  billingCycle: { _status: null },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_BILLING_CYCLE:
      return { ...state, billingCycleId: action.billingCycleId, groupId: action.groupId };
    case constants.LOADING_BILLING_CYCLE:
      return { ...state, loadingBillingCycle: true };
    case constants.LOADED_BILLING_CYCLE:
      return { ...state, loadingBillingCycle: false };
    case constants.SET_BILLING_CYCLE:
      return { ...state, billingCycle: action.billingCycle };

    case constants.LOAD_BILLING_CYCLES:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_BILLING_CYCLES:
      return { ...state, loadingBillingCycles: true };
    case constants.LOADED_BILLING_CYCLES:
      return { ...state, loadingBillingCycles: false };
    case constants.SET_BILLING_CYCLES:
      return { ...state, billingCycles: action.billingCycles };

    default:
      return state;
  }
}

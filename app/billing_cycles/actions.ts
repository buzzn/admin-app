export const constants = {
  SET_API_PARAMS: 'buzzn_billing_cycles/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_billing_cycles/SET_TOKEN',

  LOAD_BILLING_CYCLES: 'buzzn_billing_cycles/LOAD_BILLING_CYCLES',
  LOADING_BILLING_CYCLES: 'buzzn_billing_cycles/LOADING_BILLING_CYCLES',
  LOADED_BILLING_CYCLES: 'buzzn_billing_cycles/LOADED_BILLING_CYCLES',
  SET_BILLING_CYCLES: 'buzzn_billing_cycles/SET_BILLING_CYCLES',

  LOAD_BILLING_CYCLE: 'buzzn_billing_cycles/LOAD_BILLING_CYCLE',
  LOADING_BILLING_CYCLE: 'buzzn_billing_cycles/LOADING_BILLING_CYCLE',
  LOADED_BILLING_CYCLE: 'buzzn_billing_cycles/LOADED_BILLING_CYCLE',
  SET_BILLING_CYCLE: 'buzzn_billing_cycles/SET_BILLING_CYCLE',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  loadBillingCycles: groupId => ({ type: constants.LOAD_BILLING_CYCLES, groupId }),
  loadingBillingCycles: () => ({ type: constants.LOADING_BILLING_CYCLES }),
  loadedBillingCycles: () => ({ type: constants.LOADED_BILLING_CYCLES }),
  setBillingCycles: billingCycles => ({ type: constants.SET_BILLING_CYCLES, billingCycles }),

  loadBillingCycle: ({ groupId, billingCycleId }) => ({ type: constants.LOAD_BILLING_CYCLE, groupId, billingCycleId }),
  loadingBillingCycle: () => ({ type: constants.LOADING_BILLING_CYCLE }),
  loadedBillingCycle: () => ({ type: constants.LOADED_BILLING_CYCLE }),
  setBillingCycle: billingCycle => ({ type: constants.SET_BILLING_CYCLE, billingCycle }),
};

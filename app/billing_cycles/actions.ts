export const constants = {
  SET_API_PARAMS: 'buzzn_billing_cycles/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_billing_cycles/SET_TOKEN',

  SET_VALIDATION_RULES: 'buzzn_billing_cycles/SET_VALIDATION_RULES',

  LOAD_BILLING_CYCLES: 'buzzn_billing_cycles/LOAD_BILLING_CYCLES',
  LOADING_BILLING_CYCLES: 'buzzn_billing_cycles/LOADING_BILLING_CYCLES',
  LOADED_BILLING_CYCLES: 'buzzn_billing_cycles/LOADED_BILLING_CYCLES',
  SET_BILLING_CYCLES: 'buzzn_billing_cycles/SET_BILLING_CYCLES',

  LOAD_BILLING_CYCLE: 'buzzn_billing_cycles/LOAD_BILLING_CYCLE',
  LOADING_BILLING_CYCLE: 'buzzn_billing_cycles/LOADING_BILLING_CYCLE',
  LOADED_BILLING_CYCLE: 'buzzn_billing_cycles/LOADED_BILLING_CYCLE',
  SET_BILLING_CYCLE: 'buzzn_billing_cycles/SET_BILLING_CYCLE',

  GET_BILLING_CYCLE_ZIP: 'buzzn_billing_cycles/GET_BILLING_CYCLE_ZIP',
  GET_BILLING_CYCLE_REPORT_ID: 'buzzn_billing_cycles/GET_BILLING_CYCLE_REPORT_ID',
  GET_BILLING_CYCLE_REPORT: 'buzzn_billing_cycles/GET_BILLING_CYCLE_REPORT',

  ADD_BILLING_CYCLE: 'buzzn_billing_cycles/ADD_BILLING_CYCLE',

  LOAD_BILLING: 'buzzn_billing_cycles/LOAD_BILLING',
  LOADING_BILLING: 'buzzn_billing_cycles/LOADING_BILLING',
  LOADED_BILLING: 'buzzn_billing_cycles/LOADED_BILLING',
  SET_BILLING: 'buzzn_billing_cycles/SET_BILLING',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setValidationRules: validationRules => ({ type: constants.SET_VALIDATION_RULES, validationRules }),

  loadBillingCycles: groupId => ({ type: constants.LOAD_BILLING_CYCLES, groupId }),
  loadingBillingCycles: () => ({ type: constants.LOADING_BILLING_CYCLES }),
  loadedBillingCycles: () => ({ type: constants.LOADED_BILLING_CYCLES }),
  setBillingCycles: billingCycles => ({ type: constants.SET_BILLING_CYCLES, billingCycles }),

  loadBillingCycle: ({ groupId, billingCycleId }) => ({ type: constants.LOAD_BILLING_CYCLE, groupId, billingCycleId }),
  loadingBillingCycle: () => ({ type: constants.LOADING_BILLING_CYCLE }),
  loadedBillingCycle: () => ({ type: constants.LOADED_BILLING_CYCLE }),
  setBillingCycle: ({ billingCycle, billingCycleBars }) => ({
    type: constants.SET_BILLING_CYCLE,
    billingCycle,
    billingCycleBars,
  }),

  getBillingCycleZip: ({ groupId, billingCycleId, groupName, year }) => ({
    type: constants.GET_BILLING_CYCLE_ZIP,
    groupId,
    billingCycleId,
    groupName,
    year,
  }),
  getBillingCycleReportId: ({ groupId, billingCycleId }) => ({
    type: constants.GET_BILLING_CYCLE_REPORT_ID,
    groupId,
    billingCycleId,
  }),
  getBillingCycleReport: ({ groupId, billingCycleId, groupName, year, reportId }) => ({
    type: constants.GET_BILLING_CYCLE_REPORT,
    groupId,
    billingCycleId,
    groupName,
    year,
    reportId,
  }),

  addBillingCycle: ({ params, resolve, reject, groupId }) => ({
    type: constants.ADD_BILLING_CYCLE,
    params,
    resolve,
    reject,
    groupId,
  }),

  loadBilling: ({ groupId, billingId, billingCycleId }) => ({
    type: constants.LOAD_BILLING,
    groupId,
    billingId,
    billingCycleId,
  }),
  loadingBilling: () => ({ type: constants.LOADING_BILLING }),
  loadedBilling: () => ({ type: constants.LOADED_BILLING }),
  setBilling: billing => ({ type: constants.SET_BILLING, billing }),
};

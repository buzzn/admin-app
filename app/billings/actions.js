export const constants = {
  SET_API_PARAMS: 'buzzn_billings/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_billings/SET_TOKEN',

  SET_VALIDATION_RULES: 'buzzn_billings/SET_VALIDATION_RULES',

  LOAD_BILLINGS: 'buzzn_billings/LOAD_BILLINGS',
  LOADING_BILLINGS: 'buzzn_billings/LOADING_BILLINGS',
  LOADED_BILLINGS: 'buzzn_billings/LOADED_BILLINGS',
  SET_BILLINGS: 'buzzn_billings/SET_BILLINGS',

  LOAD_BILLING: 'buzzn_billings/LOAD_BILLING',
  LOADING_BILLING: 'buzzn_billings/LOADING_BILLING',
  LOADED_BILLING: 'buzzn_billings/LOADED_BILLING',
  SET_BILLING: 'buzzn_billings/SET_BILLING',

  ADD_BILLING: 'buzzn_billings/ADD_BILLING',

  UPDATE_BILLING: 'buzzn_billings/UPDATE_BILLING',

  ATTACH_READING: 'buzzn_billings/ATTACH_READING',

  GET_BILLING_PDF_DATA: 'buzzn_billings/GET_BILLING_PDF_DATA',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setValidationRules: (ruleType, validationRules) => ({
    type: constants.SET_VALIDATION_RULES,
    ruleType,
    validationRules,
  }),

  loadBillings: ({ groupId, contractId }) => ({ type: constants.LOAD_BILLINGS, groupId, contractId }),
  loadingBillings: () => ({ type: constants.LOADING_BILLINGS }),
  loadedBillings: () => ({ type: constants.LOADED_BILLINGS }),
  setBillings: billings => ({ type: constants.SET_BILLINGS, billings }),

  loadBilling: ({ groupId, contractId, billingId }) => ({
    type: constants.LOAD_BILLING,
    groupId,
    contractId,
    billingId,
  }),
  loadingBilling: () => ({ type: constants.LOADING_BILLING }),
  loadedBilling: () => ({ type: constants.LOADED_BILLING }),
  setBilling: ({ billing }) => ({ type: constants.SET_BILLING, billing }),

  addBilling: ({ params, resolve, reject, groupId, contractId }) => ({
    type: constants.ADD_BILLING,
    params,
    resolve,
    reject,
    groupId,
    contractId,
  }),

  updateBilling: ({ params, resolve, reject, groupId, contractId, billingId, noReload }) => ({
    type: constants.UPDATE_BILLING,
    params,
    resolve,
    reject,
    groupId,
    contractId,
    billingId,
    noReload,
  }),

  attachReading: ({ params, resolve, reject, groupId, contractId, billingId, billingItemId }) => ({
    type: constants.ATTACH_READING,
    params,
    resolve,
    reject,
    groupId,
    contractId,
    billingId,
    billingItemId,
  }),

  getBillingPDFData: ({ groupId, contractId, billingId, documentId, fileName }) => ({
    type: constants.GET_BILLING_PDF_DATA,
    groupId,
    contractId,
    billingId,
    documentId,
    fileName,
  }),
};

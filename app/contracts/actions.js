export const constants = {
  SET_API_PARAMS: 'buzzn_contracts/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_contracts/SET_TOKEN',

  SET_VALIDATION_RULES: 'buzzn_contracts/SET_VALIDATION_RULES',

  LOAD_CONTRACT: 'buzzn_contracts/LOAD_CONTRACT',
  LOADING_CONTRACT: 'buzzn_contracts/LOADING_CONTRACT',
  LOADED_CONTRACT: 'buzzn_contracts/LOADED_CONTRACT',
  SET_CONTRACT: 'buzzn_contracts/SET_CONTRACT',

  LOAD_CONTRACT_BALANCE_SHEET: 'buzzn_contracts/LOAD_CONTRACT_BALANCE_SHEET',
  LOADING_CONTRACT_BALANCE_SHEET: 'buzzn_contracts/LOADING_CONTRACT_BALANCE_SHEET',
  LOADED_CONTRACT_BALANCE_SHEET: 'buzzn_contracts/LOADED_CONTRACT_BALANCE_SHEET',
  SET_CONTRACT_BALANCE_SHEET: 'buzzn_contracts/SET_CONTRACT_BALANCE_SHEET',

  LOAD_CONTRACT_PAYMENTS: 'buzzn_contracts/LOAD_CONTRACT_PAYMENTS',
  LOADING_CONTRACT_PAYMENTS: 'buzzn_contracts/LOADING_CONTRACT_PAYMENTS',
  LOADED_CONTRACT_PAYMENTS: 'buzzn_contracts/LOADED_CONTRACT_PAYMENTS',
  SET_CONTRACT_PAYMENTS: 'buzzn_contracts/SET_CONTRACT_PAYMENTS',

  LOAD_GROUP_CONTRACTS: 'buzzn_contracts/LOAD_GROUP_CONTRACTS',
  LOADING_GROUP_CONTRACTS: 'buzzn_contracts/LOADING_GROUP_CONTRACTS',
  LOADED_GROUP_CONTRACTS: 'buzzn_contracts/LOADED_GROUP_CONTRACTS',
  SET_GROUP_CONTRACTS: 'buzzn_contracts/SET_GROUP_CONTRACTS',

  LOAD_GROUP_POWERTAKERS: 'buzzn_contracts/LOAD_GROUP_POWERTAKERS',
  LOADING_GROUP_POWERTAKERS: 'buzzn_contracts/LOADING_GROUP_POWERTAKERS',
  LOADED_GROUP_POWERTAKERS: 'buzzn_contracts/LOADED_GROUP_POWERTAKERS',
  SET_GROUP_POWERTAKERS: 'buzzn_contracts/SET_GROUP_POWERTAKERS',

  ATTACH_BANK_ACCOUNT: 'buzzn_contracts/ATTACH_BANK_ACCOUNT',
  ADD_BANK_ACCOUNT: 'buzzn_contracts/ADD_BANK_ACCOUNT',
  UPDATE_BANK_ACCOUNT: 'buzzn_contracts/UPDATE_BANK_ACCOUNT',

  ADD_CONTRACT: 'buzzn_contracts/ADD_CONTRACT',
  UPDATE_CONTRACT: 'buzzn_contracts/UPDATE_CONTRACT',

  ADD_PAYMENT: 'buzzn_contracts/ADD_PAYMENT',
  UPDATE_PAYMENT: 'buzzn_contracts/UPDATE_PAYMENT',
  DELETE_PAYMENT: 'buzzn_contracts/DELETE_PAYMENT',

  GENERATE_CONTRACT_PDF: 'buzzn_contracts/GENERATE_CONTRACT_PDF',
  ATTACH_CONTRACT_PDF: 'buzzn_contracts/ATTACH_CONTRACT_PDF',
  DELETE_CONTRACT_PDF: 'buzzn_contracts/DELETE_CONTRACT_PDF',
  GET_CONTRACT_PDF_META: 'buzzn_contracts/GET_CONTRACT_PDF_META',
  GET_CONTRACT_PDF_DATA: 'buzzn_contracts/GET_CONTRACT_PDF_DATA',

  DELETE_END_DATE: 'buzzn_contracts/DELETE_END_DATE',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  setValidationRules: (ruleType, validationRules) => ({
    type: constants.SET_VALIDATION_RULES,
    ruleType,
    validationRules,
  }),

  loadContract: ({ contractId, groupId }) => ({ type: constants.LOAD_CONTRACT, contractId, groupId }),
  loadingContract: () => ({ type: constants.LOADING_CONTRACT }),
  loadedContract: () => ({ type: constants.LOADED_CONTRACT }),
  setContract: ({ contract, contractor, customer }) => ({
    type: constants.SET_CONTRACT,
    contract,
    contractor,
    customer,
  }),

  loadContractBalanceSheet: ({ contractId, groupId }) => ({
    type: constants.LOAD_CONTRACT_BALANCE_SHEET,
    contractId,
    groupId,
  }),
  loadingContractBalanceSheet: () => ({ type: constants.LOADING_CONTRACT_BALANCE_SHEET }),
  loadedContractBalanceSheet: () => ({ type: constants.LOADED_CONTRACT_BALANCE_SHEET }),
  setContractBalanceSheet: balanceSheet => ({ type: constants.SET_CONTRACT_BALANCE_SHEET, balanceSheet }),

  loadContractPayments: ({ contractId, groupId }) => ({
    type: constants.LOAD_CONTRACT_PAYMENTS,
    contractId,
    groupId,
  }),
  loadingContractPayments: () => ({ type: constants.LOADING_CONTRACT_PAYMENTS }),
  loadedContractPayments: () => ({ type: constants.LOADED_CONTRACT_PAYMENTS }),
  setContractPayments: payments => ({ type: constants.SET_CONTRACT_PAYMENTS, payments }),

  loadGroupContracts: groupId => ({ type: constants.LOAD_GROUP_CONTRACTS, groupId }),
  loadingGroupContracts: () => ({ type: constants.LOADING_GROUP_CONTRACTS }),
  loadedGroupContracts: () => ({ type: constants.LOADED_GROUP_CONTRACTS }),
  setGroupContracts: contracts => ({ type: constants.SET_GROUP_CONTRACTS, contracts }),

  loadGroupPowertakers: ({ groupId, withBillings }) => ({
    type: constants.LOAD_GROUP_POWERTAKERS,
    groupId,
    withBillings,
  }),
  loadingGroupPowertakers: () => ({ type: constants.LOADING_GROUP_POWERTAKERS }),
  loadedGroupPowertakers: () => ({ type: constants.LOADED_GROUP_POWERTAKERS }),
  setGroupPowertakers: powertakers => ({ type: constants.SET_GROUP_POWERTAKERS, powertakers }),

  attachBankAccount: ({ params, resolve, reject, groupId, contractId, partyType }) => ({
    type: constants.ATTACH_BANK_ACCOUNT,
    params,
    resolve,
    reject,
    groupId,
    contractId,
    partyType,
  }),
  addBankAccount: ({ params, resolve, reject, groupId, partyId, partyType }) => ({
    type: constants.ADD_BANK_ACCOUNT,
    params,
    resolve,
    reject,
    groupId,
    partyId,
    partyType,
  }),
  updateBankAccount: ({ bankAccountId, params, resolve, reject, groupId, partyId, partyType }) => ({
    type: constants.UPDATE_BANK_ACCOUNT,
    bankAccountId,
    params,
    resolve,
    reject,
    groupId,
    partyId,
    partyType,
  }),

  addContract: ({ groupId, resolve, reject, params }) => ({
    type: constants.ADD_CONTRACT,
    groupId,
    resolve,
    reject,
    params,
  }),
  updateContract: ({ groupId, contractId, resolve, reject, params, updateType }) => {
    return {
      type: constants.UPDATE_CONTRACT,
      groupId,
      contractId,
      resolve,
      reject,
      params,
      updateType,
    }
  },

  addPayment: ({ groupId, contractId, resolve, reject, params }) => ({
    type: constants.ADD_PAYMENT,
    groupId,
    contractId,
    resolve,
    reject,
    params,
  }),
  updatePayment: ({ groupId, contractId, paymentId, resolve, reject, params }) => ({
    type: constants.UPDATE_PAYMENT,
    groupId,
    contractId,
    paymentId,
    resolve,
    reject,
    params,
  }),
  deletePayment: ({ groupId, contractId, paymentId }) => ({
    type: constants.DELETE_PAYMENT,
    groupId,
    contractId,
    paymentId,
  }),

  generateContractPDF: ({ groupId, contractId, resolve, reject, template }) => ({
    type: constants.GENERATE_CONTRACT_PDF,
    groupId,
    contractId,
    resolve,
    reject,
    template,
  }),
  attachContractPDF: ({ groupId, contractId, params, resolve, reject }) => ({
    type: constants.ATTACH_CONTRACT_PDF,
    groupId,
    contractId,
    params,
    resolve,
    reject,
  }),
  deleteContractPDF: ({ groupId, contractId, documentId, resolve, reject }) => ({
    type: constants.DELETE_CONTRACT_PDF,
    groupId,
    contractId,
    documentId,
    resolve,
    reject,
  }),
  getContractPDFMeta: ({ groupId, contractId, documentId }) => ({
    type: constants.GET_CONTRACT_PDF_META,
    groupId,
    contractId,
    documentId,
  }),
  getContractPDFData: ({ groupId, contractId, documentId, fileName }) => ({
    type: constants.GET_CONTRACT_PDF_DATA,
    groupId,
    contractId,
    documentId,
    fileName,
  }),
  deleteEndDate: ({ groupId, contractId, resolve, reject }) => ({
    type: constants.DELETE_END_DATE,
    groupId,
    contractId,
    resolve,
    reject,
  }),
};

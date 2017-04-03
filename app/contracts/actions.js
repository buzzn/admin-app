export const constants = {
  SET_API_PARAMS: 'buzzn_contracts/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_contracts/SET_TOKEN',

  LOAD_CONTRACT: 'buzzn_contracts/LOAD_CONTRACT',
  LOADING_CONTRACT: 'buzzn_contracts/LOADING_CONTRACT',
  LOADED_CONTRACT: 'buzzn_contracts/LOADED_CONTRACT',
  SET_CONTRACT: 'buzzn_contracts/SET_CONTRACT',

  LOAD_GROUP_CONTRACTS: 'buzzn_contracts/LOAD_GROUP_CONTRACTS',
  LOADING_GROUP_CONTRACTS: 'buzzn_contracts/LOADING_GROUP_CONTRACTS',
  LOADED_GROUP_CONTRACTS: 'buzzn_contracts/LOADED_GROUP_CONTRACTS',
  SET_GROUP_CONTRACTS: 'buzzn_contracts/SET_GROUP_CONTRACTS',

  UPDATE_BANK_ACCOUNT: 'buzzn_contracts/UPDATE_BANK_ACCOUNT',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  loadContract: contractId => ({ type: constants.LOAD_CONTRACT, contractId }),
  loadingContract: () => ({ type: constants.LOADING_CONTRACT }),
  loadedContract: () => ({ type: constants.LOADED_CONTRACT }),
  setContract: ({ contract, contractor, customer }) => ({ type: constants.SET_CONTRACT, contract, contractor, customer }),

  loadGroupContracts: groupId => ({ type: constants.LOAD_GROUP_CONTRACTS, groupId }),
  loadingGroupContracts: () => ({ type: constants.LOADING_GROUP_CONTRACTS }),
  loadedGroupContracts: () => ({ type: constants.LOADED_GROUP_CONTRACTS }),
  setGroupContracts: contracts => ({ type: constants.SET_GROUP_CONTRACTS, contracts }),

  updateBankAccount: ({ bankAccountId, params, resolve, reject }) => (
    { type: constants.UPDATE_BANK_ACCOUNT, bankAccountId, params, resolve, reject }),
};

export const constants = {
  SET_API_PARAMS: 'buzzn_contracts/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_contracts/SET_TOKEN',

  LOAD_GROUP_CONTRACTS: 'buzzn_contracts/LOAD_GROUP_CONTRACTS',

  LOADING_OPERATOR_CONTRACT: 'buzzn_contracts/LOADING_OPERATOR_CONTRACT',
  LOADED_OPERATOR_CONTRACT: 'buzzn_contracts/LOADED_OPERATOR_CONTRACT',
  SET_OPERATOR_CONTRACT: 'buzzn_contracts/SET_OPERATOR_CONTRACT',

  LOADING_PROCESSING_CONTRACT: 'buzzn_contracts/LOADING_PROCESSING_CONTRACT',
  LOADED_PROCESSING_CONTRACT: 'buzzn_contracts/LOADED_PROCESSING_CONTRACT',
  SET_PROCESSING_CONTRACT: 'buzzn_contracts/SET_PROCESSING_CONTRACT',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  loadGroupContracts: groupId => ({ type: constants.LOAD_GROUP_CONTRACTS, groupId }),

  loadingOperatorContract: () => ({ type: constants.LOADING_OPERATOR_CONTRACT }),
  loadedOperatorContract: () => ({ type: constants.LOADED_OPERATOR_CONTRACT }),
  setOperatorContract: contract => ({ type: constants.SET_OPERATOR_CONTRACT, contract }),

  loadingProcessingContract: () => ({ type: constants.LOADING_PROCESSING_CONTRACT }),
  loadedProcessingContract: () => ({ type: constants.LOADED_PROCESSING_CONTRACT }),
  setProcessingContract: contract => ({ type: constants.SET_PROCESSING_CONTRACT, contract }),
};

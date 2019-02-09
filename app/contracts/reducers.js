import { constants } from './actions';

export const initialState = {
  loadingContract: false,
  loadingContractBalanceSheet: false,
  loadingContractPayments: false,
  loadingGroupContracts: false,
  loadingGroupPowertakers: false,
  contract: { _status: null },
  balanceSheet: { _status: null },
  payments: { _status: null, array: [] },
  contractor: { _status: null },
  customer: { _status: null },
  groupContracts: [],
  groupPowertakers: { _status: null, array: [] },
  validationRules: {
    lpc: { _status: null },
    lptp: { _status: null },
    lpto: { _status: null },
    lptUpdate: { _status: null },
    lptOrgCustomer: { _status: null },
    lptPerCustomer: { _status: null },
    payment: { _status: null },
    paymentUpdate: { _status: null },
    bankAccountUpdate: { _status: null },
    bankAccountCreate: { _status: null },
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: { ...state.validationRules, [action.ruleType]: action.validationRules } };

    case constants.LOAD_GROUP_CONTRACTS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_GROUP_CONTRACTS:
      return { ...state, loadingGroupContracts: true };
    case constants.LOADED_GROUP_CONTRACTS:
      return { ...state, loadingGroupContracts: false };
    case constants.SET_GROUP_CONTRACTS:
      return { ...state, groupContracts: action.contracts };

    case constants.LOAD_CONTRACT:
      return { ...state, contractId: action.contractId, groupId: action.groupId };
    case constants.LOADING_CONTRACT:
      return { ...state, loadingContract: true };
    case constants.LOADED_CONTRACT:
      return { ...state, loadingContract: false };
    case constants.SET_CONTRACT:
      return { ...state, contract: action.contract, contractor: action.contractor, customer: action.customer };

    case constants.LOAD_CONTRACT_BALANCE_SHEET:
      return { ...state, contractId: action.contractId, groupId: action.groupId };
    case constants.LOADING_CONTRACT_BALANCE_SHEET:
      return { ...state, loadingContractBalanceSheet: true };
    case constants.LOADED_CONTRACT_BALANCE_SHEET:
      return { ...state, loadingContractBalanceSheet: false };
    case constants.SET_CONTRACT_BALANCE_SHEET:
      return { ...state, balanceSheet: action.balanceSheet };

    case constants.LOAD_CONTRACT_PAYMENTS:
      return { ...state, contractId: action.contractId, groupId: action.groupId };
    case constants.LOADING_CONTRACT_PAYMENTS:
      return { ...state, loadingContractPayments: true };
    case constants.LOADED_CONTRACT_PAYMENTS:
      return { ...state, loadingContractPayments: false };
    case constants.SET_CONTRACT_PAYMENTS:
      return { ...state, payments: action.payments };

    case constants.LOAD_GROUP_POWERTAKERS:
      return { ...state, groupId: action.groupId, withBillings: action.withBillings };
    case constants.LOADING_GROUP_POWERTAKERS:
      return { ...state, loadingGroupPowertakers: true };
    case constants.LOADED_GROUP_POWERTAKERS:
      return { ...state, loadingGroupPowertakers: false };
    case constants.SET_GROUP_POWERTAKERS:
      return { ...state, groupPowertakers: action.powertakers };

    default:
      return state;
  }
}

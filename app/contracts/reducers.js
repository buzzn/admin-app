import { constants } from './actions';

export const initialState = {
  loadingContract: false,
  loadingGroupContracts: false,
  loadingGroupPowertakers: false,
  contract: { _status: null },
  contractor: { _status: null },
  customer: { _status: null },
  groupContracts: [],
  groupPowertakers: { _status: null, array: [] },
  validationRules: { lpc: { _status: null } },
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

    case constants.LOAD_GROUP_POWERTAKERS:
      return { ...state, groupId: action.groupId };
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

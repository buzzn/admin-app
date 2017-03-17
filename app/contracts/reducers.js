import { constants } from './actions';

export const initialState = {
  loadingContract: false,
  loadingGroupContracts: false,
  contract: {},
  contractor: {},
  customer: {},
  groupContracts: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_GROUP_CONTRACTS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_GROUP_CONTRACTS:
      return { ...state, loadingGroupContracts: true };
    case constants.LOADED_GROUP_CONTRACTS:
      return { ...state, loadingGroupContracts: false };
    case constants.SET_GROUP_CONTRACTS:
      return { ...state, groupContracts: action.contracts };

    case constants.LOAD_CONTRACT:
      return { ...state, contractId: action.contractId };
    case constants.LOADING_CONTRACT:
      return { ...state, loadingContract: true };
    case constants.LOADED_CONTRACT:
      return { ...state, loadingContract: false };
    case constants.SET_CONTRACT:
      return { ...state, contract: action.contract, contractor: action.contractor, customer: action.customer };

    default:
      return state;
  }
}

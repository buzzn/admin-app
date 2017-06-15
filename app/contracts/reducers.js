import { constants } from './actions';

export const initialState = {
  loadingContract: false,
  loadingGroupContracts: false,
  loadingGroupPowertakers: false,
  loadingGroupPowertaker: false,
  contract: {},
  contractor: {},
  customer: {},
  groupContracts: [],
  groupPowertakers: [],
  groupPowertaker: {},
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

    case constants.LOAD_GROUP_POWERTAKER:
      return { ...state, groupId: action.groupId, powertakerId: action.powertakerId, powertakerType: action.powertakerType };
    case constants.LOADING_GROUP_POWERTAKER:
      return { ...state, loadingGroupPowertaker: true };
    case constants.LOADED_GROUP_POWERTAKER:
      return { ...state, loadingGroupPowertaker: false };
    case constants.SET_GROUP_POWERTAKER:
      return { ...state, groupPowertaker: action.powertaker };

    default:
      return state;
  }
}

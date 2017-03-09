import { constants } from './actions';

export const initialState = {
  loadingOperatorContract: false,
  loadingProcessingContract: false,
  operatorContract: null,
  processingContract: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_GROUP_CONTRACTS:
      return { ...state, groupId: action.groupId };

    case constants.LOADING_OPERATOR_CONTRACT:
      return { ...state, loadingOperatorContract: true };
    case constants.LOADED_OPERATOR_CONTRACT:
      return { ...state, loadingOperatorContract: false };
    case constants.SET_OPERATOR_CONTRACT:
      return { ...state, operatorContract: action.contract };

    case constants.LOADING_PROCESSING_CONTRACT:
      return { ...state, loadingProcessingContract: true };
    case constants.LOADED_PROCESSING_CONTRACT:
      return { ...state, loadingProcessingContract: false };
    case constants.SET_PROCESSING_CONTRACT:
      return { ...state, processingContract: action.contract };

    default:
      return state;
  }
}

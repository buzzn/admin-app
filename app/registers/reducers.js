import { constants } from './actions';

export const initialState = {
  loading: false,
  registers: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_REGISTERS:
      return { ...state, meterId: action.meterId, meterType: action.meterType };
    case constants.LOADING_REGISTERS:
      return { ...state, loading: true };
    case constants.LOADED_REGISTERS:
      return { ...state, loading: false };
    case constants.SET_REGISTERS:
      return { ...state, registers: action.registers };
    default:
      return state;
  }
}

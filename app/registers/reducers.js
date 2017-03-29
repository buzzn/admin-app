import { constants } from './actions';

export const initialState = {
  loadingRegisters: false,
  loadingRegister: false,
  registers: [],
  register: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_REGISTER:
      return { ...state, registerId: action.registerId };
    case constants.LOADING_REGISTER:
      return { ...state, loadingRegister: true };
    case constants.LOADED_REGISTER:
      return { ...state, loadingRegister: false };
    case constants.SET_REGISTER:
      return { ...state, register: action.register };

    case constants.LOAD_REGISTERS:
      return { ...state, meterId: action.meterId, meterType: action.meterType, groupId: action.groupId };
    case constants.LOADING_REGISTERS:
      return { ...state, loadingRegisters: true };
    case constants.LOADED_REGISTERS:
      return { ...state, loadingRegisters: false };
    case constants.SET_REGISTERS:
      return { ...state, registers: action.registers };

    default:
      return state;
  }
}

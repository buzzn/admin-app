import { constants } from './actions';

export const initialState = {
  loadingRegisters: false,
  loadingRegister: false,
  registers: { _status: null, array: [] },
  register: { _status: null },
  registerPower: { _status: null },
  readings: { _status: null, array: [] },
  validationRules: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_REGISTER:
      return { ...state, registerId: action.registerId, groupId: action.groupId };
    case constants.LOADING_REGISTER:
      return { ...state, loadingRegister: true };
    case constants.LOADED_REGISTER:
      return { ...state, loadingRegister: false };
    case constants.SET_REGISTER:
      return { ...state, register: action.register, readings: action.readings };

    case constants.SET_REGISTER_POWER:
      return { ...state, registerPower: action.power };

    case constants.LOAD_REGISTERS:
      return { ...state, groupId: action.groupId };
    case constants.LOADING_REGISTERS:
      return { ...state, loadingRegisters: true };
    case constants.LOADED_REGISTERS:
      return { ...state, loadingRegisters: false };
    case constants.SET_REGISTERS:
      return { ...state, registers: action.registers };

    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: action.validationRules };

    default:
      return state;
  }
}

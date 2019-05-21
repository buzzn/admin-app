import { constants } from './actions';

export const initialState = {
  loadingRegisters: false,
  loadingRegister: false,
  register: { _status: null },
  registerPower: {},
  validationRules: { metaUpdate: { _status: null }, realUpdate: { _status: null } },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_REGISTER:
      return { ...state, registerId: action.registerId, groupId: action.groupId, meterId: action.meterId };
    case constants.LOADING_REGISTER:
      return { ...state, loadingRegister: true };
    case constants.LOADED_REGISTER:
      return { ...state, loadingRegister: false };
    case constants.SET_REGISTER:
      return { ...state, register: action.register };

    case constants.SET_REGISTER_POWER:
      return { ...state, registerPower: { ...state.registerPower, [action.registerId]: action.power } };

    case constants.SET_VALIDATION_RULES:
      return { ...state, validationRules: { ...state.validationRules, [action.ruleType]: action.validationRules } };

    default:
      return state;
  }
}

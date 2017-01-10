import { constants } from './actions';

export const initialState = {
  configured: false,
  profiles: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.SET_PROFILE:
      return { ...state, profiles: { ...state.profiles, [action.userId]: action.profile } };
    case constants.LOADING_PROFILE:
      return { ...state, profiles: { ...state.profiles, [action.userId]: { loading: true } } };
    case constants.FAILED_PROFILE:
      return { ...state, profiles: { ...state.profiles, [action.userId]: { loading: false, failed: true } } };
    case constants.SET_TOKEN:
      return { ...state, configured: true };
    default:
      return state;
  }
}

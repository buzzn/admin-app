import { constants } from './actions';

export const initialState = {
  configured: false,
  loadingProfile: false,
  profiles: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOADING_PROFILE:
      return { ...state, loadingProfile: true };
    case constants.LOADED_PROFILE:
      return { ...state, loadingProfile: false };
    case constants.SET_PROFILE:
      return { ...state, profiles: { ...state.profiles, [action.userId]: action.profile } };
    case constants.SET_TOKEN:
      return { ...state, configured: true };
    default:
      return state;
  }
}

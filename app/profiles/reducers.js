import { constants } from './actions';

export const initialState = {
  configured: false,
  loadingProfiles: false,
  loadingProfile: false,
  profiles: [],
  userProfiles: [],
  profile: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_PROFILE:
      return { ...state, profileId: action.profileId };
    case constants.LOADING_PROFILE:
      return { ...state, loadingProfile: true };
    case constants.LOADED_PROFILE:
      return { ...state, loadingProfile: false };
    case constants.SET_PROFILE:
      return { ...state, profile: action.profile };

    case constants.LOADING_PROFILES:
      return { ...state, loadingProfiles: true };
    case constants.LOADED_PROFILES:
      return { ...state, loadingProfiles: false };
    case constants.SET_PROFILES:
      return { ...state, profiles: action.profiles };

    case constants.SET_TOKEN:
      return { ...state, configured: true };

    default:
      return state;
  }
}

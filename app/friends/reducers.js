import { constants } from './actions';

export const initialState = {
  loading: false,
  friends: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_FRIENDS:
      return { ...state, userId: action.userId };
    case constants.LOADING_FRIENDS:
      return { ...state, loading: true };
    case constants.LOADED_FRIENDS:
      return { ...state, loading: false };
    case constants.SET_FRIENDS:
      return { ...state, friends: action.friends };
    default:
      return state;
  }
}

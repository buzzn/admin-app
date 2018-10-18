import { constants } from './actions';

export const initialState = {
  loadingWebsiteForms: false,
  websiteForms: { _status: null, array: [] },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_WEBSITE_FORMS:
      return { ...state };
    case constants.LOADING_WEBSITE_FORMS:
      return { ...state, loadingWebsiteForms: true };
    case constants.LOADED_WEBSITE_FORMS:
      return { ...state, loadingWebsiteForms: false };
    case constants.SET_WEBSITE_FORMS:
      return { ...state, websiteForms: action.websiteForms };

    default:
      return state;
  }
}

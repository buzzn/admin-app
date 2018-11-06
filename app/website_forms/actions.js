export const constants = {
  SET_API_PARAMS: 'buzzn_website_forms/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_website_forms/SET_TOKEN',

  LOAD_WEBSITE_FORMS: 'buzzn_website_forms/LOAD_WEBSITE_FORMS',
  LOADING_WEBSITE_FORMS: 'buzzn_website_forms/LOADING_WEBSITE_FORMS',
  LOADED_WEBSITE_FORMS: 'buzzn_website_forms/LOADED_WEBSITE_FORMS',
  SET_WEBSITE_FORMS: 'buzzn_website_forms/SET_WEBSITE_FORMS',

  UPDATE_WEBSITE_FORM: 'buzzn_website_forms/UPDATE_WEBSITE_FORM',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  loadWebsiteForms: () => ({ type: constants.LOAD_WEBSITE_FORMS }),
  loadingWebsiteForms: () => ({ type: constants.LOADING_WEBSITE_FORMS }),
  loadedWebsiteForms: () => ({ type: constants.LOADED_WEBSITE_FORMS }),
  setWebsiteForms: websiteForms => ({ type: constants.SET_WEBSITE_FORMS, websiteForms }),

  updateWebsiteForm: ({ formId, params, resolve, reject }) => ({
    type: constants.UPDATE_WEBSITE_FORM,
    formId,
    params,
    resolve,
    reject,
  }),
};

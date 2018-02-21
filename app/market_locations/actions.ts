export const constants = {
  SET_API_PARAMS: 'buzzn_market_locations/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_market_locations/SET_TOKEN',

  LOAD_MARKET_LOCATIONS: 'buzzn_market_locations/LOAD_MARKET_LOCATIONS',
  LOADING_MARKET_LOCATIONS: 'buzzn_market_locations/LOADING_MARKET_LOCATIONS',
  LOADED_MARKET_LOCATIONS: 'buzzn_market_locations/LOADED_MARKET_LOCATIONS',
  SET_MARKET_LOCATIONS: 'buzzn_market_locations/SET_MARKET_LOCATIONS',

  LOAD_MARKET_LOCATION: 'buzzn_market_locations/LOAD_MARKET_LOCATION',
  LOADING_MARKET_LOCATION: 'buzzn_market_locations/LOADING_MARKET_LOCATION',
  LOADED_MARKET_LOCATION: 'buzzn_market_locations/LOADED_MARKET_LOCATION',
  SET_MARKET_LOCATION: 'buzzn_market_locations/SET_MARKET_LOCATION',
};

export const actions = {
  setApiParams: ({ apiPath, apiUrl }) => ({ type: constants.SET_API_PARAMS, apiPath, apiUrl }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),

  loadMarketLocations: groupId => ({ type: constants.LOAD_MARKET_LOCATIONS, groupId }),
  loadingMarketLocations: () => ({ type: constants.LOADING_MARKET_LOCATIONS }),
  loadedMarketLocations: () => ({ type: constants.LOADED_MARKET_LOCATIONS }),
  setMarketLocations: marketLocations => ({ type: constants.SET_MARKET_LOCATIONS, marketLocations }),

  loadMarketLocation: ({ groupId, locationId }) => ({ type: constants.LOAD_MARKET_LOCATION, groupId, locationId }),
  loadingMarketLocation: () => ({ type: constants.LOADING_MARKET_LOCATION }),
  loadedMarketLocation: () => ({ type: constants.LOADED_MARKET_LOCATION }),
  setMarketLocation: marketLocation => ({ type: constants.SET_MARKET_LOCATION, marketLocation }),
};

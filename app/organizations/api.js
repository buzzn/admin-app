import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchAvailableOrganizations({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/organizations?include=address,legal_representation,contact:[address]`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchAvailableOrganizationMarkets({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/organization_markets?include=market_functions`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys)
      .then(res => ({
        ...res,
        array: res.array.filter(o => o.marketFunctions.array.find(f => f.function === 'electricity_supplier')),
      }));
  },
};

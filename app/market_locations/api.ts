import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchMarketLocation({ token, apiUrl, apiPath, locationId, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/market-locations/${locationId}?include=contracts:[customer],register:[meter]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchMarketLocations({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/market-locations?include=contracts:[customer],register:[meter]`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

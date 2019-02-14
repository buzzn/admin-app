import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchMarketLocation({ token, apiUrl, apiPath, locationId, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/register-metas/${locationId}?include=contracts:[customer],registers:[meter]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchMarketLocations({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/register-metas?include=contracts:[customer],registers:[meter]`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

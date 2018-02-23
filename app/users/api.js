import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchUser({ token, apiUrl, apiPath, userId }) {
    return fetch(
      `${apiUrl}${apiPath}/persons/${userId}?include=address,contracts:[localpool,market_location:[register]]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchGroupUser({ token, apiUrl, apiPath, userId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/persons/${userId}`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchGroupUsers({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/persons`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchGroupManagers({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/managers`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

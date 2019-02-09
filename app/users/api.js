import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchUser({ token, apiUrl, apiPath, userId }) {
    return fetch(
      `${apiUrl}${apiPath}/persons/${userId}?include=address,contracts:[localpool,register_meta:[registers]]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchGroupUser({ token, apiUrl, apiPath, userId, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/persons/${userId}?include=bank_accounts,address,contracts:[localpool,register_meta:[registers]]`,
      { headers: prepareHeaders(token) },
    )
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
  fetchAvailableUsers({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/persons?include=address`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

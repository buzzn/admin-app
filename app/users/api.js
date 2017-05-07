import 'whatwg-fetch';
import flatten from 'lodash/flatten';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchUser({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchUsers({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/users`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse);
  },
  fetchGroupMembers({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/${groupId}/members`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse);
  },
  fetchGroupManagers({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/${groupId}/managers`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse);
  },
  fetchGroupPowertakers({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/${groupId}/energy-consumers`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse);
  },
};

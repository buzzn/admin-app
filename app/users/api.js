import 'whatwg-fetch';
import flatten from 'lodash/flatten';
import { prepareHeaders, parseResponse, remainingPages } from '../_util';

export default {
  fetchUser({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse);
  },
  fetchUsers({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/users`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, model: 'users', endpoint: '' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },
  fetchGroupMembers({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/${groupId}/members`)
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, model: 'groups', id: groupId, endpoint: 'members' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },
};

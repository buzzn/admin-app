import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, camelizeResponseArray } from '../_util';

export default {
  fetchGroup({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/${groupId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchGroups({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/groups`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseArray);
  },
  fetchUserGroups({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}/groups`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseArray);
  },
};

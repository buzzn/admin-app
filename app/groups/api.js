import 'whatwg-fetch';
import flatten from 'lodash/flatten';
import { prepareHeaders, parseResponse, remainingPages, mergeData } from '../_util';

export default {
  fetchGroup({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/${groupId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(mergeData);
  },
  fetchGroups({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/groups`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, model: 'groups', endpoint: '' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },
  fetchUserGroups({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}/groups`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, id: userId, model: 'users', endpoint: 'groups' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },
};

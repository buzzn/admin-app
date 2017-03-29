import 'whatwg-fetch';
import flatten from 'lodash/flatten';
import { prepareHeaders, parseResponse, remainingPages, camelizeResponseArray, camelizeResponseKeys } from '../_util';

export default {
  fetchMeter({ token, apiUrl, apiPath, meterId }) {
    return fetch(`${apiUrl}${apiPath}/meters/${meterId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => camelizeResponseKeys(json.data));
  },
  fetchGroupMeters({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/${groupId}/meters`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => camelizeResponseArray(json.data));
  },
  fetchUserMeters({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}/meters`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, id: userId, model: 'users', endpoint: 'meters' }))
    .then(jsonArr => camelizeResponseArray(flatten(jsonArr.map(json => json.data))));
  },
};

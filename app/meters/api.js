import 'whatwg-fetch';
import flatten from 'lodash/flatten';
import { prepareHeaders, parseResponse, remainingPages } from '../_util';

export default {
  fetchMeters({ token, apiUrl, apiPath }) {
    console.log('fetchMeters');
    return fetch(`${apiUrl}${apiPath}/meters`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse);
  },

  fetchUserMeters({ token, apiUrl, apiPath, userId }) {
    console.log('fetchUserMeters');
    return fetch(`${apiUrl}${apiPath}/users/${userId}/meters`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, id: userId, model: 'users', endpoint: 'meter' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },
};

import 'whatwg-fetch';
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';
import flatten from 'lodash/flatten';
import { prepareHeaders, parseResponse, remainingPages } from './_util';

export default {

  fetchUserMe({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/users/me`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => ({ userMe: json.data.id }));
  },

  fetchUserFriends({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}/friends`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, id: userId, model: 'users', endpoint: 'friends' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },

};

import 'whatwg-fetch';
import flatten from 'lodash/flatten';
import { prepareHeaders, parseResponse, remainingPages } from '../_util';

export default {

  fetchProfile({ token, apiUrl, apiPath, profileId }) {
    return fetch(`${apiUrl}${apiPath}/profiles/${profileId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse);
  },


  fetchProfiles({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/profiles`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, model: 'profiles', endpoint: '' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },


  fetchUserProfile({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}/profile`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, id: userId, model: 'users', endpoint: 'profile' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },

};

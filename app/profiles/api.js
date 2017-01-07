import 'whatwg-fetch';
import flatten from 'lodash/flatten';
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';
import { prepareHeaders, parseResponse, remainingPages } from '../_util';

function normalizeProfile(json) {
  const { firstName, lastName, phone, title, gender, slug, aboutMe } = mapKeys(json.attributes, (value, key) => camelCase(key));
  return { id: json.id, firstName, lastName, phone, title, gender, slug, aboutMe };
}

export default {
  fetchProfile({ token, apiUrl, apiPath, profileId }) {
    return fetch(`${apiUrl}${apiPath}/profiles/${profileId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => normalizeProfile(json.data));
  },
  fetchProfiles({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/profiles`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, model: 'profiles', endpoint: '' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data.map(profile => normalizeProfile(profile)))));
  },
  fetchUserProfile({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}/profile`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => normalizeProfile(json.data));
  },
};

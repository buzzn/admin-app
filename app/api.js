import 'whatwg-fetch';
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';
import map from 'lodash/map';
import range from 'lodash/range';
import flatten from 'lodash/flatten';

function prepareHeaders(token) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function parseResponse(response) {
  const json = response.json();
  if (response.status >= 200 && response.status < 300) {
    return json;
  } else {
    return json.then(error => Promise.reject(error));
  }
}

function normalizeProfile(json) {
  const { firstName, lastName, phone, title, gender, slug } = mapKeys(json.data.attributes, (value, key) => camelCase(key));
  return { firstName, lastName, phone, title, gender, slug };
}

function remainingPages({ apiUrl, apiPath, id, json, model, endpoint, token }) {
  const totalPages = json.meta.total_pages;
  if (totalPages === 1) {
    return [json];
  } else {
    return Promise.all(map(range(totalPages), page => (
      fetch(`${apiUrl}${apiPath}/${model}/${id}/${endpoint}?page=${page + 1}`, { headers: prepareHeaders(token) })
      .then(parseResponse)
    )));
  }
}

export default {

  getGroups({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/groups`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    // .then(json => remainingPages({ apiUrl, apiPath, json, token, id: userId, model: 'users', endpoint: 'groups' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },


  getUserMe({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/users/me`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => ({ userMe: json.data.id }));
  },

  getUserProfile({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}/profile`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => normalizeProfile(json));
  },

  getUserFriends({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}/friends`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, id: userId, model: 'users', endpoint: 'friends' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },

  getUserGroups({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}/groups`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, id: userId, model: 'users', endpoint: 'groups' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },

};

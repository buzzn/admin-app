import 'whatwg-fetch';
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';
import { prepareHeaders, parseResponse } from '../_util';

function normalizeProfile(json) {
  const {
    firstName,
    lastName,
    phone,
    title,
    gender,
    slug,
    aboutMe,
    mdImg,
  } = mapKeys(json.attributes, (value, key) => camelCase(key));
  return { id: json.id, firstName, lastName, phone, title, gender, slug, aboutMe, mdImg };
}

export default {
  fetchUserProfile({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}/profile`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => normalizeProfile(json.data));
  },
};

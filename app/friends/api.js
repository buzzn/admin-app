import 'whatwg-fetch';
import flatten from 'lodash/flatten';
import { prepareHeaders, parseResponse, remainingPages } from '../_util';

export default {
  fetchUserFriends({ token, apiUrl, apiPath, userId }) {
    return fetch(`${apiUrl}${apiPath}/users/${userId}/friends`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => remainingPages({ apiUrl, apiPath, json, token, id: userId, model: 'users', endpoint: 'friends' }))
    .then(jsonArr => flatten(jsonArr.map(json => json.data)));
  },
};

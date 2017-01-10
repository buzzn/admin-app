import 'whatwg-fetch';
import { prepareHeaders, parseResponse } from './_util';

export default {
  fetchUserMe({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/users/me`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => ({ userMe: json.data.id }));
  },
};

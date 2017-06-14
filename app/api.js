import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from './_util';

export default {
  fetchUserMe({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/me`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
};

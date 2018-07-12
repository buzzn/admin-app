import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchAvailableOrganizations({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/organizations`, { headers: prepareHeaders(token) })
    // return fetch(`${apiUrl}${apiPath}/organizations?include=contact:[address]`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchWebsiteForms({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/website-forms`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

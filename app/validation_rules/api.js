import 'whatwg-fetch';
import { prepareHeaders, parseResponse } from '../_util';

export default {
  fetchValidationRules({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/swagger.json`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse);
  },
};

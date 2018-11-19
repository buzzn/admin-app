import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchWebsiteForms({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/website-forms`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  updateWebsiteForm({ token, apiUrl, apiPath, formId, params }) {
    return fetch(`${apiUrl}${apiPath}/website-forms/${formId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

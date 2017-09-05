import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from './_util';

export default {
  fetchUserMe({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/me?include=address,bank_accounts`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  updateUserMe({ token, apiUrl, apiPath, params }) {
    return fetch(`${apiUrl}${apiPath}/me`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    })
    .then(parseResponse);
  },
};

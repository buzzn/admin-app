import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from './_util';

export default {
  fetchUserMe({ token, apiUrl }) {
    return fetch(`${apiUrl}api/me?include=address,bank_accounts`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  updateUserMe({ token, apiUrl, params }) {
    return fetch(`${apiUrl}api/me`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    })
    .then(parseResponse);
  },
};

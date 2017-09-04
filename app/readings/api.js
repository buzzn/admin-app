import 'whatwg-fetch';
import { prepareHeaders, parseResponse, snakeReq } from '../_util';

export default {
  addReading({ token, apiUrl, apiPath, meterId, registerId, params, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}/registers/${registerId}/readings`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    })
    .then(parseResponse);
  },
  deleteReading({ token, apiUrl, apiPath, meterId, registerId, groupId, readingId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}/registers/${registerId}/readings/${readingId}`, {
      headers: prepareHeaders(token),
      method: 'DELETE',
    })
    .then(parseResponse);
  },
};

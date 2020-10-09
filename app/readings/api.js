import 'whatwg-fetch';
import { prepareHeaders, parseResponse, snakeReq, camelizeResponseKeys } from '../_util';

export default {
  addReading({ token, apiUrl, apiPath, meterId, registerId, params, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}/registers/${registerId}/readings`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  fetchAutoReadingValue({ token, apiUrl, apiPath, groupId, meterId, registerId, params }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}/registers/${registerId}/readings/request/read`,
      {
        headers: prepareHeaders(token),
        method: 'POST',
        body: JSON.stringify(snakeReq(params)),
      },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  calculateReading({ token, apiUrl, apiPath, groupId, contractId, billingId, billingItemId, params }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/billings/${billingId}/items/${billingItemId}/calculate`,
      {
        headers: prepareHeaders(token),
        method: 'PATCH',
        body: JSON.stringify(snakeReq(params)),
      },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  deleteReading({ token, apiUrl, apiPath, meterId, registerId, groupId, readingId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}/registers/${registerId}/readings/${readingId}`,
      {
        headers: prepareHeaders(token),
        method: 'DELETE',
      },
    );
  },
};

import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchBilling({ token, apiUrl, apiPath, billingId, groupId, contractId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/billings/${billingId}?include=items:[tariff,register],accounting_entry`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchBillings({ token, apiUrl, apiPath, groupId, contractId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/billings?include=items:[tariff,meter,register:[readings]],accounting_entry`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  addBilling({ token, apiUrl, apiPath, groupId, contractId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/billings`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateBilling({ token, apiUrl, apiPath, billingId, groupId, contractId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/billings/${billingId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  attachReading({ token, apiUrl, apiPath, billingId, groupId, contractId, billingItemId, params }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/billings/${billingId}/items/${billingItemId}`,
      {
        headers: prepareHeaders(token),
        method: 'PATCH',
        body: JSON.stringify(snakeReq(params)),
      },
    ).then(parseResponse);
  },
};

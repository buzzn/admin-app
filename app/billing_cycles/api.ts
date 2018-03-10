import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchBillingCycle({ token, apiUrl, apiPath, billingCycleId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/billing-cycles/${billingCycleId}`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchbillingCycleItems({ token, apiUrl, apiPath, billingCycleId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/billing-cycles/${billingCycleId}/items`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchBillingCycles({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/billing-cycles`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  addBillingCycle({ token, apiUrl, apiPath, groupId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/billing-cycles`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
};

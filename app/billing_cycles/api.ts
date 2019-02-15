import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchBillingCycle({ token, apiUrl, apiPath, billingCycleId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/billing-cycles/${billingCycleId}?include=billings`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchbillingCycleBars({ token, apiUrl, apiPath, billingCycleId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/billing-cycles/${billingCycleId}/bars`, { headers: prepareHeaders(token) })
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
  fetchBilling({ token, apiUrl, apiPath, billingId, groupId, billingCycleId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/billing-cycles/${billingCycleId}/billings/${billingId}?include=contract:[customer],items:[meter,tariff]`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchBillingCycle({ token, apiUrl, apiPath, billingCycleId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/billing-cycles/${billingCycleId}`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchBillingCycles({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/billing-cycles`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

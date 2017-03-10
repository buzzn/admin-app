import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchContract({ token, apiUrl, apiPath, contractId }) {
    return fetch(`${apiUrl}${apiPath}/contracts/${contractId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => camelizeResponseKeys(json.data));
  },
  fetchOperatorContract({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/localpools/${groupId}/metering-point-operator-contract`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => camelizeResponseKeys(json.data));
  },
  fetchProcessingContract({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/localpools/${groupId}/localpool-processing-contract`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => camelizeResponseKeys(json.data));
  },
};

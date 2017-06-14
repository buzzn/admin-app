import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchRegister({ token, apiUrl, apiPath, registerId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/registers/${registerId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchRegisterReadings({ token, apiUrl, apiPath, registerId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/registers/${registerId}/readings`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchGroupRegisters({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/registers`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
};

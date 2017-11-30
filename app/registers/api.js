import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq, formatLabel } from '../_util';

export default {
  fetchRegister({ token, apiUrl, apiPath, registerId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/registers/${registerId}`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchRegisterPower({ token, apiUrl, apiPath, registerId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/registers/${registerId}/ticker`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys)
      .then(res => ({ ...res, value: formatLabel(res.value) }));
  },
  updateRegister({ token, apiUrl, apiPath, meterId, registerId, params, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}/registers/${registerId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    })
      .then(parseResponse);
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

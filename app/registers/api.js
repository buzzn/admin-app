import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchRegister({ token, apiUrl, apiPath, registerId, groupId, meterId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}/registers/${registerId}?include=readings,register_meta`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchRegisterPower({ token, apiUrl, apiPath, registerId, groupId, meterId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}/registers/${registerId}/ticker`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  updateRegister({ token, apiUrl, apiPath, meterId, registerId, params, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}/registers/${registerId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    })
      .then(parseResponse);
  },
};

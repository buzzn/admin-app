import 'whatwg-fetch';
import {
  prepareHeaders,
  parseResponse,
  camelizeResponseKeys,
  snakeReq,
} from '../_util';

export default {
  fetchMeter({ token, apiUrl, apiPath, meterId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}?include=registers`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  updateMeter({ token, apiUrl, apiPath, meterId, params, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    })
    .then(parseResponse);
  },
  fetchGroupMeters({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
};

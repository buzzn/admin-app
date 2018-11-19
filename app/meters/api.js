import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchMeter({ token, apiUrl, apiPath, meterId, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}?include=registers:[readings,register_meta:[contracts:[customer:[contact]]]]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  addRealMeter({ token, apiUrl, apiPath, groupId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateMeter({ token, apiUrl, apiPath, meterId, params, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateFormulaPart({ token, apiUrl, apiPath, groupId, meterId, formulaPartId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}/formula-parts/${formulaPartId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  fetchGroupMeters({ token, apiUrl, apiPath, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/meters?include=registers:[readings,register_meta,contracts:[customer]],formula_parts:[register]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

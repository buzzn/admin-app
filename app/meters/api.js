// @flow
import 'whatwg-fetch';
import {
  prepareHeaders,
  parseResponse,
  camelizeResponseKeys,
  snakeReq,
} from '../_util';

type Api = {
  token: string,
  apiUrl: string,
  apiPath: string,
};

export default {
  fetchMeter({ token, apiUrl, apiPath, meterId, groupId }:
               Api & { groupId: string, meterId: string }): Promise<Object> {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}?include=registers,formula_parts:register`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  updateMeter({ token, apiUrl, apiPath, meterId, params, groupId }:
                Api & { meterId: string, params: Object, groupId: string }): Promise<Object> {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    })
      .then(parseResponse);
  },
  updateFormulaPart({ token, apiUrl, apiPath, groupId, meterId, formulaPartId, params }:
                      Api & { groupId: string, meterId: string, formulaPartId: string, params: Object }):
                      Promise<Object> {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}/formula-parts/${formulaPartId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    })
      .then(parseResponse);
  },
  fetchGroupMeters({ token, apiUrl, apiPath, groupId }: Api & { groupId: string }): Promise<Array<Object>> {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters?include=registers`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

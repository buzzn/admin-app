// @flow
import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

type Api = {
  token: string,
  apiUrl: string,
  apiPath: string,
};

export default {
  fetchGroup({ token, apiUrl, apiPath, groupId }: Api & { groupId: string }): Promise<Object> {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}?include=address,distribution_system_operator,transmission_system_operator,electricity_supplier,owner:[bank_accounts,address,contact:[bank_accounts,address]]`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  updateGroup({ token, apiUrl, apiPath, params, groupId }: Api & { params: Object, groupId: string }): Promise<Object> {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    })
      .then(parseResponse);
  },
  fetchGroups({ token, apiUrl, apiPath }: Api): Promise<Object> {
    return fetch(`${apiUrl}${apiPath}/localpools`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

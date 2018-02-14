import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchGroup({ token, apiUrl, apiPath, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}?include=
                          tariffs,address,distribution_system_operator,
                          transmission_system_operator,electricity_supplier,
                          owner:[bank_accounts,address,contact:[bank_accounts,address]],
                          gap_contract_customer:[address,bank_accounts,contact:[address]]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  updateGroup({ token, apiUrl, apiPath, params, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  fetchGroups({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/localpools`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

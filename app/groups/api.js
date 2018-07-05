import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchGroup({ token, apiUrl, apiPath, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}?include=tariffs,address,distribution_system_operator,transmission_system_operator,electricity_supplier,owner:[bank_accounts,address,contact:[bank_accounts,address]],gap_contract_customer:[address,bank_accounts,contact:[address]]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  addGroup({ token, apiUrl, apiPath, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateGroup({ token, apiUrl, apiPath, params, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  deleteGroup({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}`, {
      headers: prepareHeaders(token),
      method: 'DELETE',
    });
  },
  updateOwner({ token, apiUrl, apiPath, groupId, params, update, ownerId, ownerType }) {
    let url = `${apiUrl}${apiPath}/localpools/${groupId}/`;
    let method = 'POST';
    let body = JSON.stringify(snakeReq(params));
    if (update) {
      method = 'PATCH';
      if (ownerType === 'person') {
        url += 'person-owner';
      } else {
        url += 'organization-owner';
      }
    } else if (ownerId) {
      body = null;
      if (ownerType === 'person') {
        url += `person-owner/${ownerId}`;
      } else {
        url += `organization-owner/${ownerId}`;
      }
    } else if (ownerType === 'person') {
      url += 'person-owner';
    } else {
      url += 'organization-owner';
    }
    return fetch(url, {
      headers: prepareHeaders(token),
      method,
      body,
    }).then(parseResponse);
  },
  fetchGroups({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/localpools`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
};

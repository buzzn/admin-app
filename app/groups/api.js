import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchGroup({ token, apiUrl, apiPath, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}?include=billing_detail,tariffs,address,distribution_system_operator,transmission_system_operator,electricity_supplier,owner:[bank_accounts,address,legal_representation,contact:[bank_accounts,address]],gap_contract_customer_bank_account,gap_contract_customer:[address,bank_accounts,contact:[address]]`,
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
  updateGroupTSO({ token, apiUrl, apiPath, params, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/transmission-system-operator`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateGroupDSO({ token, apiUrl, apiPath, params, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/distribution-system-operator`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateGroupES({ token, apiUrl, apiPath, params, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/electricity-supplier`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateGroupContact({ token, apiUrl, apiPath, groupId, params, update, contactId, contactType, isGap }) {
    let url = `${apiUrl}${apiPath}/localpools/${groupId}/`;
    let method = 'POST';
    let body = JSON.stringify(snakeReq(params));
    // if (isGap) url += 'organization-gap-contract-customer';
    // if (isGap) url += 'person-gap-contract-customer';
    if (update) {
      method = 'PATCH';
      if (contactType === 'person') {
        url += isGap ? 'person-gap-contract-customer' : 'person-owner';
      } else {
        url += isGap ? 'organization-gap-contract-customer' : 'organization-owner';
      }
    } else if (contactId) {
      body = null;
      if (contactType === 'person') {
        url += isGap ? 'person-gap-contract-customer' : 'person-owner';
      } else {
        url += isGap ? 'organization-gap-contract-customer' : 'organization-owner';
      }
      url += `/${contactId}`;
    } else if (contactType === 'person') {
      url += isGap ? 'person-gap-contract-customer' : 'person-owner';
    } else {
      url += isGap ? 'organization-gap-contract-customer' : 'organization-owner';
    }
    return fetch(url, {
      headers: prepareHeaders(token),
      method,
      body,
    }).then(parseResponse);
  },
  fetchGroups({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/localpools?include=localpool_processing_contracts`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  }
};

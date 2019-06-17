import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchOrganization({ token, apiUrl, apiPath, organizationId }) {
    return fetch(
      `${apiUrl}${apiPath}/organizations/${organizationId}?include=address,legal_representation,contact:[address],contracts:[localpool,register_meta:[registers]]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchGroupOrganization({ token, apiUrl, apiPath, organizationId, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/organizations/${organizationId}?include=address,bank_accounts,legal_representation:[bank_accounts],contact:[address,bank_accounts],contracts:[localpool,register_meta:[registers]]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchAvailableOrganizations({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/organizations?include=address,legal_representation,contact:[address]`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchAvailableOrganizationMarkets({ token, apiUrl, apiPath }) {
    return fetch(`${apiUrl}${apiPath}/organizations-market?include=market_functions`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  addOrganizationMarket({ token, apiUrl, apiPath, params }) {
    return fetch(`${apiUrl}${apiPath}/organizations-market`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateOrganizationMarket({ token, apiUrl, apiPath, organizationId, params }) {
    return fetch(`${apiUrl}${apiPath}/organizations-market/${organizationId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  addFunctionToOrgMarket({ token, apiUrl, apiPath, organizationId, params }) {
    return fetch(`${apiUrl}${apiPath}/organizations-market/${organizationId}/market-functions`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  deleteFunctionFromOrgMarket({ token, apiUrl, apiPath, organizationId, functionId }) {
    return fetch(`${apiUrl}${apiPath}/organizations-market/${organizationId}/market-functions/${functionId}`, {
      headers: prepareHeaders(token),
      method: 'DELETE',
    });
  },
  updateOrganizationMarketFunction({ token, apiUrl, apiPath, organizationId, functionId, params }) {
    return fetch(`${apiUrl}${apiPath}/organizations-market/${organizationId}/market-functions/${functionId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
};

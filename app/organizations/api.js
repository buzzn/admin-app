import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchOrganization({ token, apiUrl, apiPath, organizationId }) {
    return fetch(
      `${apiUrl}${apiPath}/organizations/${organizationId}?include=address,legal_representation,contact:[address],contracts:[localpool,register_meta:[register]]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchGroupOrganization({ token, apiUrl, apiPath, organizationId, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/organizations/${organizationId}?include=address,bank_accounts,legal_representation:[bank_accounts],contact:[address,bank_accounts],contracts:[localpool,register_meta:[register]]`,
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
    return fetch(`${apiUrl}${apiPath}/organization_markets?include=market_functions`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys)
      .then(res => ({
        ...res,
        array: res.array.filter(o => o.marketFunctions.array.find(f => f.function === 'electricity_supplier')),
      }));
  },
};

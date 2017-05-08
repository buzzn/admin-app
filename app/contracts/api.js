import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

export default {
  fetchContract({ token, apiUrl, apiPath, contractId }) {
    return fetch(`${apiUrl}${apiPath}/contracts/${contractId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchContractor({ token, apiUrl, apiPath, contractId }) {
    return fetch(`${apiUrl}${apiPath}/contracts/${contractId}/contractor`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchCustomer({ token, apiUrl, apiPath, contractId }) {
    return fetch(`${apiUrl}${apiPath}/contracts/${contractId}/customer`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  // TODO: it can be replaced with organization module later if needed
  fetchOrganization({ token, apiUrl, apiPath, organizationId }) {
    return fetch(`${apiUrl}${apiPath}/organizations/${organizationId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchOrganizationAddress({ token, apiUrl, apiPath, organizationId }) {
    return fetch(`${apiUrl}${apiPath}/organizations/${organizationId}/address`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchOrganizationBankAccount({ token, apiUrl, apiPath, organizationId }) {
    return fetch(`${apiUrl}${apiPath}/organizations/${organizationId}/bank-account`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  updateBankAccount({ token, apiUrl, apiPath, bankAccountId, params }) {
    return fetch(`${apiUrl}${apiPath}/bank-accounts/${bankAccountId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(params),
    })
    .then(parseResponse);
  },
  fetchOperatorContract({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/localpools/${groupId}/metering-point-operator-contract`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchProcessingContract({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/localpools/${groupId}/localpool-processing-contract`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
};

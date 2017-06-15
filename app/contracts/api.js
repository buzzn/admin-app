import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, camelizeResponseArray } from '../_util';

export default {
  fetchContract({ token, apiUrl, apiPath, contractId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}?include=contractor,customer,tariffs,payments,contractor_bank_account,customer_bank_account`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchGroupPowertakers({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/power-taker-contracts?include=customer`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    // FIXME: this is a workaround. Should be fixed after buzzn/buzzn #999
    .then(contracts => contracts.array.map(c => ({ ...c.customer })))
    .then(camelizeResponseArray);
  },
  fetchGroupPowertaker({ token, apiUrl, apiPath, groupId, powertakerId, powertakerType }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/${powertakerType}s/${powertakerId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  updateBankAccount({ token, apiUrl, apiPath, bankAccountId, params, groupId, partyId, partyType }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/${partyType}s/${partyId}/bank-accounts/${bankAccountId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(params),
    })
    .then(parseResponse);
  },
  fetchOperatorContract({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/metering-point-operator-contract`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchProcessingContract({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/localpool-processing-contract`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
};

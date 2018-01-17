import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, camelizeResponseArray, snakeReq } from '../_util';

export default {
  fetchContract({ token, apiUrl, apiPath, contractId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}?include=contrator_bank_account,contractor:[address],customer_bank_account,customer:[address,contact:address],tariffs,payments`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchGroupPowertakers({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/power-taker-contracts?include=register,customer:[address,contact:address]`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  updateBankAccount({ token, apiUrl, apiPath, bankAccountId, params, groupId, partyId, partyType }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/${partyType}s/${partyId}/bank-accounts/${bankAccountId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    })
      .then(parseResponse);
  },
  fetchOperatorContract({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/metering-point-operator-contract?include=customer:[address,contact:address]`, {
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

import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, camelizeResponseArray, snakeReq } from '../_util';

export default {
  fetchContract({ token, apiUrl, apiPath, contractId, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}?include=register_meta:[register:[meter]],contrator_bank_account,contractor:[address],customer_bank_account,customer:[address,contact:address],tariffs,payments,documents`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchContractTariffs({ token, apiUrl, apiPath, contractId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/tariffs?include=tariff`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys)
      .then(r => ({ array: r.array.map(t => ({ ...t, ...t.tariff })) }));
  },
  fetchGroupPowertakers({ token, apiUrl, apiPath, groupId }) {
    return (
      fetch(
        `${apiUrl}${apiPath}/localpools/${groupId}/contracts?include=register_meta:[register],customer:[address,contact:address]`,
        { headers: prepareHeaders(token) },
      )
        .then(parseResponse)
        .then(camelizeResponseKeys)
        // FIXME
        .then(json => ({
          ...json,
          array: json.array.filter(c => ['contract_localpool_power_taker', 'contract_localpool_third_party'].includes(c.type)),
        }))
    );
  },
  fetchGroupPowertakersWithBillings({ token, apiUrl, apiPath, groupId }) {
    return (
      fetch(
        `${apiUrl}${apiPath}/localpools/${groupId}/contracts?include=billings:[items:[tariff,meter,register:[readings]]],register_meta:[register],customer:[address,contact:address]`,
        { headers: prepareHeaders(token) },
      )
        .then(parseResponse)
        .then(camelizeResponseKeys)
        // FIXME
        .then(json => ({
          ...json,
          array: json.array.filter(c => ['contract_localpool_power_taker', 'contract_localpool_third_party'].includes(c.type)),
        }))
    );
  },
  updateBankAccount({ token, apiUrl, apiPath, bankAccountId, params, groupId, partyId, partyType }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/${partyType}s/${partyId}/bank-accounts/${bankAccountId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  fetchOperatorContracts({ token, apiUrl, apiPath, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/contracts?type=contract_metering_point_operator&include=documents,customer:[address,contact:address]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchProcessingContracts({ token, apiUrl, apiPath, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/contracts?type=contract_localpool_processing&include=documents,customer:[address,contact:address]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchGroupContracts({ token, apiUrl, apiPath, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/contracts?include=documents,customer:[address,contact:address]`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  addContract({ token, apiUrl, apiPath, groupId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateContract({ token, apiUrl, apiPath, groupId, contractId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateContractTariffs({ token, apiUrl, apiPath, groupId, contractId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/tariffs`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateOrganizationCustomer({ token, apiUrl, apiPath, groupId, contractId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/customer-organization`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updatePersonCustomer({ token, apiUrl, apiPath, groupId, contractId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/customer-person`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  generateContractPDF({ token, apiUrl, apiPath, groupId, contractId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/documents/generate`, {
      headers: prepareHeaders(token),
      method: 'POST',
    }).then(parseResponse);
  },
  attachContractPDF({ token, apiUrl, apiPath, groupId, contractId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/documents`, {
      headers: prepareHeaders(token, true),
      method: 'POST',
      body: params,
    }).then(parseResponse);
  },
  deleteContractPDF({ token, apiUrl, apiPath, groupId, contractId, documentId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/documents/${documentId}`, {
      headers: prepareHeaders(token),
      method: 'DELETE',
    });
  },
  fetchContractPDFMeta({ token, apiUrl, apiPath, groupId, contractId, documentId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/documents/${documentId}`, { headers: prepareHeaders(token) }).then(parseResponse);
  },
  fetchContractPDFData({ token, apiUrl, apiPath, groupId, contractId, documentId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/documents/${documentId}/fetch`, { headers: prepareHeaders(token) }).then(parseResponse);
  },
};

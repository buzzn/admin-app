import 'whatwg-fetch';
import snakeCase from 'lodash/snakeCase';
import { prepareHeaders, parseResponse, camelizeResponseKeys, camelizeResponseArray, snakeReq } from '../_util';

export default {
  fetchContract({ token, apiUrl, apiPath, contractId, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}?include=billings:[documents,items:[tariff,meter,register:[readings]]],balance_sheet:[entries],register_meta:[registers:[meter,readings]],contractor_bank_account,contractor:[bank_accounts,address],customer_bank_account,customer:[bank_accounts,address,contact:address],tariffs,payments,documents`,
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
  fetchContractBalanceSheet({ token, apiUrl, apiPath, contractId, groupId }) {
    return fetch(
      `${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/accounting/balance_sheet?include=entries`,
      { headers: prepareHeaders(token) },
    )
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchContractPayments({ token, apiUrl, apiPath, contractId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/payments`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchGroupPowertakers({ token, apiUrl, apiPath, groupId }) {
    return (
      fetch(
        `${apiUrl}${apiPath}/localpools/${groupId}/contracts?include=register_meta:[registers],customer:[address,contact:address],tariffs,documents`,
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
        `${apiUrl}${apiPath}/localpools/${groupId}/contracts?include=billings,customer`,
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
  attachBankAccount({ token, apiUrl, apiPath, params, groupId, contractId, partyType }) {
    const url = contractId
      ? `${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/${partyType}-bank-account`
      : `${apiUrl}${apiPath}/localpools/${groupId}/gap-contract-customer-bank-account`;
    return fetch(url, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  addBankAccount({ token, apiUrl, apiPath, params, groupId, partyId, partyType }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/${partyType}s/${partyId}/bank-accounts`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
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
      `${apiUrl}${apiPath}/localpools/${groupId}/contracts?include=documents,billings:[documents],customer:[address,contact:address]`,
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
  addPayment({ token, apiUrl, apiPath, contractId, groupId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/payments`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updatePayment({ token, apiUrl, apiPath, groupId, contractId, paymentId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/payments/${paymentId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  deletePayment({ token, apiUrl, apiPath, groupId, contractId, paymentId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/payments/${paymentId}`, {
      headers: prepareHeaders(token),
      method: 'DELETE',
    });
  },
  updateContract({ token, apiUrl, apiPath, groupId, contractId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateContractAccount({ token, apiUrl, apiPath, groupId, contractId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/accounting/book`, {
      headers: prepareHeaders(token),
      method: 'POST',
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
  generateContractPDF({ token, apiUrl, apiPath, groupId, contractId, template }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/documents/generate`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify({ template: snakeCase(template).replace(/_\d+/g, str => str.split('_')[1]) }),
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

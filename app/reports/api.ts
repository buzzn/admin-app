import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchEegReport: ({ apiUrl, apiPath, token, groupId, params }) => fetch(`${apiUrl}${apiPath}/localpools/${groupId}/reports/eeg`, {
    headers: prepareHeaders(token),
    method: 'POST',
    body: JSON.stringify(snakeReq(params)),
  })
    .then(parseResponse)
    .then(camelizeResponseKeys),
  fetchAnnualReport({ token, apiUrl, apiPath, groupId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/annual-report/`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  fetchGroupMembersExport({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/group-members-export`, { headers: prepareHeaders(token) })
      .then(parseResponse);
  },
  fetchTariffChangeLettersZip({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/tariff-change-letters`, { headers: prepareHeaders(token) })
      .then(parseResponse);
  },
  fetchSendTariffChangeLetters({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/send-tariff-change-letters`, { headers: prepareHeaders(token) })
      .then(parseResponse);
  }
};

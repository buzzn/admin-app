import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchEegReport: ({ apiUrl, apiPath, token, groupId, params }) => fetch(`${apiUrl}${apiPath}/localpools/${groupId}/reports/eeg`, {
    headers: prepareHeaders(token),
    method: 'POST',
    body: JSON.stringify(snakeReq(params)),
  })
    .then(parseResponse)
    .then(camelizeResponseKeys),
};

import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchGroupComments: ({ token, apiUrl, apiPath, groupId }) => fetch(`${apiUrl}${apiPath}/localpools/${groupId}/comments`, { headers: prepareHeaders(token) })
    .then(parseResponse)
    .then(camelizeResponseKeys),
  addGroupComment: ({ token, apiUrl, apiPath, groupId, params }) => fetch(`${apiUrl}${apiPath}/localpools/${groupId}/comments`, {
    headers: prepareHeaders(token),
    method: 'POST',
    body: JSON.stringify(snakeReq(params)),
  }).then(parseResponse),
  updateGroupComment: ({ token, apiUrl, apiPath, params, groupId, commentId }) => fetch(`${apiUrl}${apiPath}/localpools/${groupId}/comments/${commentId}`, {
    headers: prepareHeaders(token),
    method: 'PATCH',
    body: JSON.stringify(snakeReq(params)),
  }).then(parseResponse),
  deleteGroupComment: ({ token, apiUrl, apiPath, groupId, commentId }) => fetch(`${apiUrl}${apiPath}/localpools/${groupId}/comments/${commentId}`, {
    headers: prepareHeaders(token),
    method: 'DELETE',
  }),
  fetchContractComments: ({ token, apiUrl, apiPath, groupId, contractId }) => fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/comments`, { headers: prepareHeaders(token) })
    .then(parseResponse)
    .then(camelizeResponseKeys),
  addContractComment: ({ token, apiUrl, apiPath, groupId, contractId, params }) => fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/comments`, {
    headers: prepareHeaders(token),
    method: 'POST',
    body: JSON.stringify(snakeReq(params)),
  }).then(parseResponse),
  updateContractComment: ({ token, apiUrl, apiPath, params, groupId, contractId, commentId }) => fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/comments/${commentId}`, {
    headers: prepareHeaders(token),
    method: 'PATCH',
    body: JSON.stringify(snakeReq(params)),
  }).then(parseResponse),
  deleteContractComment: ({ token, apiUrl, apiPath, groupId, contractId, commentId }) => fetch(`${apiUrl}${apiPath}/localpools/${groupId}/contracts/${contractId}/comments/${commentId}`, {
    headers: prepareHeaders(token),
    method: 'DELETE',
  }),
};

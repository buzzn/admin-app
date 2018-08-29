import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';

export default {
  fetchDevice({ token, apiUrl, apiPath, deviceId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/devices/${deviceId}`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchDevices({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/devices`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  addDevice({ token, apiUrl, apiPath, groupId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/devices`, {
      headers: prepareHeaders(token),
      method: 'POST',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  updateDevice({ token, apiUrl, apiPath, groupId, deviceId, params }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/devices/${deviceId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    }).then(parseResponse);
  },
  deleteDevice({ token, apiUrl, apiPath, groupId, deviceId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/devices/${deviceId}`, {
      headers: prepareHeaders(token),
      method: 'DELETE',
    });
  },
};

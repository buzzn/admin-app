import 'whatwg-fetch';
import {
  prepareHeaders,
  parseResponse,
  camelizeResponseKeys,
} from '../_util';

export default {
  fetchMeter({ token, apiUrl, apiPath, meterId, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters/${meterId}?include=registers`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchGroupMeters({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}/meters`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
};

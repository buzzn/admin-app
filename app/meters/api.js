import 'whatwg-fetch';
import {
  prepareHeaders,
  parseResponse,
  camelizeResponseArray,
  camelizeResponseKeys,
} from '../_util';

export default {
  fetchMeter({ token, apiUrl, apiPath, meterId }) {
    return fetch(`${apiUrl}${apiPath}/meters/${meterId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchGroupMeters({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/${groupId}/meters`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseArray);
  },
};

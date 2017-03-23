import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseArray } from '../_util';

export default {
  fetchMeterRegisters({ token, apiUrl, apiPath, meterId, meterType }) {
    // FIXME: temp slice workaround, see https://github.com/buzzn/buzzn/issues/680
    return fetch(`${apiUrl}${apiPath}/meters/${meterType.slice(0, -1)}/${meterId}/register${meterType === 'reals' ? 's' : ''}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => camelizeResponseArray(Array.isArray(json.data) ? json.data : [json.data]));
  },
  fetchGroupRegisters({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/${groupId}/registers`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => camelizeResponseArray(json.data));
  },
};

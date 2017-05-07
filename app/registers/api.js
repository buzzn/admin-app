import 'whatwg-fetch';
import { prepareHeaders, parseResponse, camelizeResponseArray, camelizeResponseKeys } from '../_util';

export default {
  fetchRegister({ token, apiUrl, apiPath, registerId }) {
    return fetch(`${apiUrl}${apiPath}/registers/${registerId}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseKeys);
  },
  fetchMeterRegisters({ token, apiUrl, apiPath, meterId, meterType }) {
    // FIXME: temp slice workaround, see https://github.com/buzzn/buzzn/issues/680
    return fetch(`${apiUrl}${apiPath}/meters/${meterType.split('_')[1]}/${meterId}/register${meterType.split('_')[1] === 'real' ? 's' : ''}`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(json => camelizeResponseArray(Array.isArray(json) ? json : [json]));
  },
  fetchGroupRegisters({ token, apiUrl, apiPath, groupId }) {
    return fetch(`${apiUrl}${apiPath}/groups/${groupId}/registers`, {
      headers: prepareHeaders(token),
    })
    .then(parseResponse)
    .then(camelizeResponseArray);
  },
};

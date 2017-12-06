// @flow
import 'whatwg-fetch';
import some from 'lodash/some';
import get from 'lodash/get';
import { prepareHeaders, parseResponse, camelizeResponseKeys, snakeReq } from '../_util';
import type { GroupStats } from './reducers';

type Api = {
  token: string,
  apiUrl: string,
  apiPath: string,
};

export function prepareTypes(groupMeters: Array<Object>): GroupStats {
  const groupReg = groupMeters.reduce((sum, meter) => get(meter.registers, 'array', []).concat(sum), []);
  return {
    solar: some(groupReg, r => r.label.toLowerCase() === 'production_pv'),
    fire: some(groupReg, r => r.label.toLowerCase() === 'production_chp'),
    water: some(groupReg, r => r.label.toLowerCase() === 'production_water'),
    wind: some(groupReg, r => r.label.toLowerCase() === 'production_wind'),
    production: '--', consumption: '--', autarchy: null,
  };
}

export default {
  fetchGroup({ token, apiUrl, apiPath, groupId }: Api & { groupId: string }): Promise<Object> {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}?include=address,distribution_system_operator,transmission_system_operator,electricity_supplier,owner:[bank_accounts,address,contact:[bank_accounts,address]]`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  updateGroup({ token, apiUrl, apiPath, params, groupId }: Api & { params: Object, groupId: string }): Promise<Object> {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}`, {
      headers: prepareHeaders(token),
      method: 'PATCH',
      body: JSON.stringify(snakeReq(params)),
    })
      .then(parseResponse);
  },
  fetchGroups({ token, apiUrl, apiPath }: Api): Promise<Object> {
    return fetch(`${apiUrl}${apiPath}/localpools?include=meters:[registers]`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys)
      .then(groups => {
        const groupsStats = groups.array.reduce((sum, group) => ({ ...sum, [group.id]: prepareTypes(group.meters.array) }), {});
        return {
          groups,
          groupsStats,
        };
      });
  },
};

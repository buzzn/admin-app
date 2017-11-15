// @flow
import 'whatwg-fetch';
import some from 'lodash/some';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

type Api = {
  token: string,
  apiUrl: string,
  apiPath: string,
};

export function prepareTypes(groupReg: Array<Object>): { solar: boolean, fire: boolean } {
  return {
    solar: some(groupReg, r => r.label.toLowerCase() === 'production_pv'),
    fire: some(groupReg, r => r.label.toLowerCase() === 'production_chp'),
  };
}

export default {
  fetchGroup({ token, apiUrl, apiPath, groupId }: Api & { groupId: string }): Promise<Object> {
    return fetch(`${apiUrl}${apiPath}/localpools/${groupId}`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchGroups({ token, apiUrl, apiPath }: Api): Promise<Object> {
    return fetch(`${apiUrl}${apiPath}/localpools?include=registers`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys)
      .then(groups => {
        const groupsStats = groups.array.reduce((sum, group) => ({ ...sum, [group.id]: prepareTypes(group.registers.array) }), {});
        return {
          groups,
          groupsStats,
        };
      });
  },
};

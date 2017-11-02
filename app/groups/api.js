// @flow
import 'whatwg-fetch';
import find from 'lodash/find';
import some from 'lodash/some';
import chunk from 'lodash/chunk';
import { prepareHeaders, parseResponse, camelizeResponseKeys } from '../_util';

type Api = {
  token: string,
  apiUrl: string,
  apiPath: string,
};

export function calculateAutarchy({ in: inData, out: outData }:
                                    { in: Array<{ value: number, timestamp: number }>,
                                      out: Array<{ value: number, timestamp: number }>
                                    }): null | string {
  let ownConsumption = 0;
  let foreignConsumption = 0;
  let totalConsumption = 0;
  let totalProduction = 0;
  let autarchy = null;

  inData.forEach((inValue) => {
    totalConsumption += inValue.value;
    const outValue = find(outData, o => o.timestamp === inValue.timestamp);
    if (!outValue) return;
    totalProduction += outValue.value;
    if (outValue.value >= inValue.value) {
      ownConsumption += inValue.value;
    } else {
      ownConsumption += outValue.value;
      foreignConsumption += inValue.value - outValue.value;
    }
  });

  if (foreignConsumption + ownConsumption !== 0) {
    autarchy = (ownConsumption / (foreignConsumption + ownConsumption)).toFixed(2);
  }

  return autarchy;
}

function formatNumber(value: number): string {
  const decimalPoint = ',';
  let remainder = 0;
  let leadingNumber = 0;
  let formattedNumber = '';

  if (value >= 1000000000000000) {
    remainder = Number(((value % 1000000000000000) / 1000000000000).toFixed(0));
    leadingNumber = Math.floor(value / 1000000000000000);
  } else if (value >= 1000000000000) {
    remainder = Number(((value % 1000000000000) / 1000000000).toFixed(0));
    leadingNumber = Math.floor(value / 1000000000000);
  } else if (value >= 1000000000) {
    remainder = Number(((value % 1000000000) / 1000000).toFixed(0));
    leadingNumber = Math.floor(value / 1000000000);
  } else if (value >= 1000000) {
    remainder = Number(((value % 1000000) / 1000).toFixed(0));
    leadingNumber = Math.floor(value / 1000000);
  } else if (value >= 1000) {
    remainder = Number((value % 1000).toFixed(0));
    leadingNumber = Math.floor(value / 1000);
  } else {
    remainder = 0;
    leadingNumber = value.toFixed(0);
  }
  if (remainder !== 0) {
    if (remainder < 1) {
      formattedNumber = leadingNumber.toString();
    } else if (remainder < 10) {
      formattedNumber = `${leadingNumber}${decimalPoint}00`;
    } else if (remainder < 100) {
      formattedNumber = `${leadingNumber}${decimalPoint}0${((remainder / 10).toFixed(0))}`;
    } else if (remainder < 1000) {
      formattedNumber = `${leadingNumber}${decimalPoint}${((remainder / 10).toFixed(0))}`;
    }
  } else {
    formattedNumber = leadingNumber.toString();
  }

  return formattedNumber;
}

export function formatLabel(value: number, type: 'h' | '' | void): string {
  if (typeof value !== 'number') return value;
  let result = '';

  const number = formatNumber(value);
  if (value >= 1000000000000000) {
    result = `${number} PW`;
  } else if (value >= 1000000000000) {
    result = `${number} TW`;
  } else if (value >= 1000000000) {
    result = `${number} GW`;
  } else if (value >= 1000000) {
    result = `${number} MW`;
  } else if (value >= 1000) {
    result = `${number} kW`;
  } else {
    result = `${number} W`;
  }
  return type === 'h' ? `${result}h` : result;
}

export function prepareStats(groupChart:
                               { resourceId: string,
                                 in: Array<{ value: number, timestamp: number }>,
                                 out: Array<{ value: number, timestamp: number }>
                               }): { id: string, consumption: string, production: string, autarchy: null | string } {
  return {
    id: groupChart.resourceId,
    consumption: formatLabel(chunk(groupChart.in, 4).reduce((sh, h) => (h.reduce((sv, v) => (sv + (v.value / 1000)), 0) / 4) + sh, 0), 'h'),
    production: formatLabel(chunk(groupChart.out, 4).reduce((sh, h) => (h.reduce((sv, v) => (sv + (v.value / 1000)), 0) / 4) + sh, 0), 'h'),
    autarchy: calculateAutarchy({ in: groupChart.in, out: groupChart.out }),
  };
}

export function prepareTypes(groupReg: Array<Object>, groupId: string): { id: string, solar: boolean, fire: boolean } {
  return {
    id: groupId,
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
  fetchGroups({ token, apiUrl, apiPath }: Api): Promise<Array<Object>> {
    return fetch(`${apiUrl}${apiPath}/localpools`, {
      headers: prepareHeaders(token),
    })
      .then(parseResponse)
      .then(camelizeResponseKeys);
  },
  fetchGroupsStats({ token, apiUrl, apiPath, groupIds }: Api & { groupIds: Array<string> }): Promise<Object> {
    return Promise.all(groupIds.map(groupId =>
      fetch(`${apiUrl}${apiPath}/localpools/${groupId}/charts?duration=day`, {
        headers: prepareHeaders(token),
      })
        .then(parseResponse)
        .then(camelizeResponseKeys)
        .then(prepareStats)))
      .then(chartsArr => chartsArr.reduce((sum, groupChart) => ({ ...sum, [groupChart.id]: { ...groupChart } }), {}));
  },
  fetchGroupsTypes({ token, apiUrl, apiPath, groupIds }: Api & { groupIds: Array<string> }): Promise<Object> {
    return Promise.all(groupIds.map(groupId =>
      fetch(`${apiUrl}${apiPath}/localpools/${groupId}/registers`, {
        headers: prepareHeaders(token),
      })
        .then(parseResponse)
        .then(camelizeResponseKeys)
        .then(json => prepareTypes(json.array, groupId))))
      .then(typesArr => typesArr.reduce((sum, groupType) => ({ ...sum, [groupType.id]: { ...groupType } }), {}));
  },
};

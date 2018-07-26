import forEach from 'lodash/forEach';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import reduce from 'lodash/reduce';
import last from 'lodash/last';
import Alert from 'react-s-alert';
import Auth from '@buzzn/module_auth';
import store from './configure_store';

export function prepareHeaders(token) {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

const flattenErrors = ({ errors }) =>
  reduce(
    errors,
    (res, v, k) => {
      if (Array.isArray(v)) return { ...res, [k]: v.join(', ') };
      return { ...res, [k]: flattenErrors({ errors: v }) };
    },
    {},
  );

export const wrapErrors = errors => ({
  ...camelizeResponseKeys(flattenErrors({ errors })),
  status: 422,
  _error: 'Form save failed',
});

export function parseResponse(response) {
  if (response.ok) {
    const type = response.headers.get('content-type');
    if (type === 'application/json') {
      const json = response.json();
      return json.then(res => ({ ...res, _status: 200 }));
    } else if (type === 'application/pdf') {
      return response.blob();
    }
    return Promise.reject(Error('unknown response content-type'));
  }
  const json = response.json();
  if (response.status === 503 && last(response.url.split('/')) === 'health') {
    return json;
  } else if (response.status === 404) {
    Alert.error("<h4>404</h4>I can't remember what you requested.");
    return Promise.resolve({ _status: 404 });
  } else if (response.status === 403) {
    Alert.error('<h4>403</h4>All your base are belong to us.');
    return Promise.resolve({ _status: 403 });
  } else if (response.status === 422) {
    return json.then(errors => Promise.resolve(wrapErrors(errors)));
  } else if (response.status === 401) {
    return json.then((error) => {
      if (error.error === 'This session has expired, please login again.') {
        // HACK: dirty hack and anti-pattern. But it will allow us to keep modules clean.
        store.dispatch(Auth.actions.signOut());
        return Promise.reject(error);
      }
      return Promise.reject(error);
    });
  }

  return json.then(error => Promise.reject(error));
}

export function camelizeResponseArray(data) {
  const result = [];
  forEach(data, (v) => {
    if (Array.isArray(v)) {
      result.push(camelizeResponseArray(v));
    } else if (typeof v === 'object') {
      result.push(camelizeResponseKeys(v));
    } else {
      result.push(v);
    }
  });
  return result;
}

export function camelizeResponseKeys(data) {
  const result = {};
  forEach(data, (v, _k) => {
    const k = _k === '_status' ? _k : camelCase(_k);
    if (k === 'id') {
      result[k] = String(v);
    } else if (Array.isArray(v)) {
      result[k] = camelizeResponseArray(v);
    } else if (!v) {
      result[k] = v;
    } else if (typeof v === 'object') {
      result[k] = camelizeResponseKeys(v);
    } else {
      result[k] = v;
    }
  });
  return result;
}

export function snakeReq(data) {
  return reduce(data, (res, v, k) => ({ ...res, [snakeCase(k)]: typeof v === 'object' ? snakeReq(v) : v }), {});
}

export function logException(ex, context) {
  if (Raven.isSetup()) {
    Raven.captureException(ex, { extra: context });
  }
  console.error(ex);
}

export function getAllUrlParams() {
  const queryString = window.location.search.slice(1).split('#')[0];

  if (queryString) {
    return queryString.split('&').reduce((sum, part) => {
      const partSplit = part.split('=');
      let paramNum;
      let paramName = partSplit[0].replace(/\[\d*\]/, (v) => {
        paramNum = v.slice(1, -1);
        return '';
      });
      let paramValue = typeof partSplit[1] === 'undefined' ? true : partSplit[1];

      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      if (sum[paramName]) {
        if (typeof sum[paramName] === 'string') {
          sum[paramName] = [sum[paramName]];
        }
        if (typeof paramNum === 'undefined') {
          sum[paramName].push(paramValue);
        } else {
          sum[paramName][paramNum] = paramValue;
        }
        return sum;
      }
      return { ...sum, [paramName]: paramValue };
    }, {});
  }
  return {};
}

function formatNumber(value, extended, noDecimal) {
  const decimalPoint = ',';
  let remainder = 0;
  let leadingNumber = 0;
  let formattedNumber = '';

  if (extended) {
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
  } else if (value >= 1000) {
    remainder = Number((value % 1000).toFixed(0));
    leadingNumber = Math.floor(value / 1000);
  } else {
    remainder = 0;
    leadingNumber = value.toFixed(0);
  }

  if (remainder !== 0 && !noDecimal) {
    if (remainder < 1) {
      formattedNumber = leadingNumber.toString();
    } else if (remainder < 10) {
      formattedNumber = `${leadingNumber}${decimalPoint}00`;
    } else if (remainder < 100) {
      formattedNumber = `${leadingNumber}${decimalPoint}0${(remainder / 10).toFixed(0)}`;
    } else if (remainder < 1000) {
      formattedNumber = `${leadingNumber}${decimalPoint}${(remainder / 10).toFixed(0)}`;
    }
  } else {
    formattedNumber = leadingNumber.toString();
  }

  return formattedNumber;
}

export function formatLabel(value, type, extended, noDecimal) {
  if (typeof value !== 'number') return value;
  let result = '';
  const number = formatNumber(value, extended, noDecimal);

  if (extended) {
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
  } else if (value >= 1000) {
    result = `${number} kW`;
  } else {
    result = `${number} W`;
  }

  return type === 'h' ? `${result}h` : result;
}

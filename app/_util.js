import * as Sentry from '@sentry/browser';
import forEach from 'lodash/forEach';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import reduce from 'lodash/reduce';
import last from 'lodash/last';
import Alert from 'react-s-alert';
import Auth from '@buzzn/module_auth';
import store from './configure_store';

export const cleanArrStr = str => str.replace(/\[\d*\]/, '');

export const getValidators = ({ validationRules, name }) => validationRules[camelCase(cleanArrStr(name))];

export const convertErrors = (e) => {
  // convert errors
  const errors = {};
  Object.keys(e).forEach((errKey) => {
    errors[errKey] = e[errKey] instanceof Array ? e[errKey].join() : e[errKey];
  });

  return errors;
};

export function prepareHeaders(token, noType, noCache) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
  if (!noType) headers['Content-Type'] = 'application/json';
  if (!noCache) headers['Cache-Control'] = 'no-cache';
  return headers;
}

export const formatErrMessage = (errObj, res = '') => {
  if (typeof errObj === 'string') return `${res}${errObj}`;
  if (Array.isArray(errObj)) return `${res}${errObj.join(', ')}`;
  return `${res}${Object.keys(errObj)
    .map(k => formatErrMessage(errObj[k], `${k}: `))
    .join('; ')}`;
};

export const flattenErrors = ({ errors }) => {
  if (typeof errors === 'string') return { errorMessage: errors };
  return reduce(
    errors,
    (res, v, k) => {
      if (Array.isArray(v)) return { ...res, [k]: typeof v === 'object' ? v : v.join(', ') };
      return { ...res, [k]: flattenErrors({ errors: v }) };
    },
    {},
  );
};

export const wrapErrors = errors => ({
  ...camelizeResponseKeys(flattenErrors({ errors })),
  _status: 422,
  _error: 'Form save failed',
});

export function parseResponse(response) {
  if (response.ok) {
    const type = response.headers.get('content-type');
    if (type.startsWith('application/json')) {
      const json = response.json();
      return json.then(res => ({ ...res, _status: 200 }));
    }
    if (
      type.startsWith('application/pdf')
      || type.startsWith('application/zip')
      || type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      || type.startsWith('text/csv')
    ) {
      return response.blob();
    }
    return Promise.reject(Error('unknown response content-type'));
  }
  if (response.status === 503 && last(response.url.split('/')) === 'ticker') {
    return Promise.resolve({ _status: 503 });
  }
  const json = response.json();
  if (response.status === 503 && last(response.url.split('/')) === 'health') {
    return json;
  }
  if (response.status === 404) {
    Alert.error("<h4>404</h4>I can't remember what you requested.");
    return Promise.resolve({ _status: 404 });
  }
  if (response.status === 403) {
    Alert.error('<h4>403</h4>All your base are belong to us.');
    return Promise.resolve({ _status: 403 });
  }
  if (response.status === 422) {
    return json.then(errors => Promise.resolve(wrapErrors(errors)));
  }
  if (response.status === 401) {
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
  if (typeof data === 'string' || typeof data === 'number') return data;
  return reduce(
    data,
    (res, v, k) => ({
      ...res,
      [snakeCase(k)]:
        Object.prototype.toString.call(v) === '[object Date]'
          ? v
          : Array.isArray(v)
            ? v.map(a => snakeReq(a))
            : typeof v === 'object' && v !== null
              ? snakeReq(v)
              : // HACK: server validation hack
              v === ''
                ? null
                : v,
    }),
    {},
  );
}

export function logException(ex) {
  Sentry.captureException(ex);
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


export function numberParse(locale, string) {
  const format = new Intl.NumberFormat(locale);
  const parts = format.formatToParts(12345.6);
  const numerals = Array.from({ length: 10 }).map((_, i) => format.format(i));
  const index = new Map(numerals.map((d, i) => [d, i]));
  const group = new RegExp(`[${parts.find(d => d.type === 'group').value}]`, 'g');
  const decimal = new RegExp(`[${parts.find(d => d.type === 'decimal').value}]`);
  const numeral = new RegExp(`[${numerals.join('')}]`, 'g');
  const dIndex = d => index.get(d);
  const str = string.trim().replace(group, '').replace(decimal, '.').replace(numeral, dIndex);
  return (str) ? +str : NaN;
}

export function getNumberDecimalSeperator(locale) {
  const format = new Intl.NumberFormat(locale);
  const parts = format.formatToParts(12345.6);
  return parts.find(d => d.type === 'decimal').value;
}

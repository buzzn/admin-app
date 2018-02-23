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
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export function wrapErrors(errors) {
  const formErrors = { status: 422, _error: 'Form save failed' };
  forEach(errors, (error) => {
    formErrors[camelCase(error.parameter)] = error.detail;
  });
  return formErrors;
}

export function parseResponse(response) {
  const json = response.json();
  if (response.status >= 200 && response.status < 300) {
    return json.then(res => ({ ...res, _status: 200 }));
  } else if (response.status === 503 && last(response.url.split('/')) === 'health') {
    return json;
  } else if (response.status === 404) {
    Alert.error("<h4>404</h4>I can't remember what you requested.");
    return Promise.resolve({ _status: 404 });
  } else if (response.status === 403) {
    Alert.error('<h4>403</h4>All your base are belong to us.');
    return Promise.resolve({ _status: 403 });
  } else if (response.status === 422) {
    return json.then(error => Promise.resolve(wrapErrors(error.errors)));
  } else if (response.status === 401) {
    return json.then((error) => {
      if (error.error === 'This session has expired, please login again.') {
        // HACK: dirty hack and anti-pattern. But it will allow us to keep modules clean.
        store.dispatch(Auth.actions.signOut());
        return Promise.reject(error);
      }
      return Promise.reject(error);
    });
  } else {
    return json.then(error => Promise.reject(error));
  }
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
  return reduce(data, (res, v, k) => ({ ...res, [snakeCase(k)]: v }), {});
}

export function logException(ex, context) {
  if (Raven.isSetup()) {
    Raven.captureException(ex, {
      extra: context,
    });
  }
  console.error(ex);
}

export function getAllUrlParams() {
  const queryString = window.location.search.slice(1).split('#')[0];

  if (queryString) {
    return queryString.split('&').reduce((sum, part) => {
      const partSplit = part.split('=');
      let paramNum = undefined;
      let paramName = partSplit[0].replace(/\[\d*\]/, (v) => {
        paramNum = v.slice(1, -1);
        return '';
      });
      let paramValue = typeof(partSplit[1]) === 'undefined' ? true : partSplit[1];

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
      } else {
        return { ...sum, [paramName]: paramValue };
      }
    }, {});
  } else {
    return {};
  }
}

function formatNumber(value) {
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

export function formatLabel(value, type) {
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

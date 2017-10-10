import forEach from 'lodash/forEach';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import reduce from 'lodash/reduce';
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
    return json;
  } else if (response.status === 404) {
    return Promise.resolve({ status: 404 });
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
  forEach(data, (v, k) => {
    if (Array.isArray(v)) {
      result[camelCase(k)] = camelizeResponseArray(v);
    } else if (!v) {
      result[camelCase(k)] = v;
    } else if (typeof v === 'object') {
      result[camelCase(k)] = camelizeResponseKeys(v);
    } else {
      result[camelCase(k)] = v;
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

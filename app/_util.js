import map from 'lodash/map';
import range from 'lodash/range';
import forEach from 'lodash/forEach';
import camelCase from 'lodash/camelCase';
import unset from 'lodash/unset';

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
  } else {
    return json.then(error => Promise.reject(error));
  }
}

export function mergeData(json) {
  if (!json.data || Array.isArray(json.data)) return json;
  const merged = { ...json, ...json.data };
  unset(merged, 'data');
  return merged;
}

export function remainingPages({ apiUrl, apiPath, id, json, model, endpoint, token }) {
  const totalPages = json.meta ? json.meta.total_pages : 1;
  if (totalPages === 1) {
    return [json];
  } else {
    const idPart = id ? `/${id}/` : '/';
    return Promise.all(map(range(totalPages), page => (
      fetch(`${apiUrl}${apiPath}/${model}${idPart}${endpoint}?page=${page + 1}`, { headers: prepareHeaders(token) })
      .then(parseResponse)
    )));
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

import map from 'lodash/map';
import range from 'lodash/range';

export function prepareHeaders(token) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export function parseResponse(response) {
  const json = response.json();
  if (response.status >= 200 && response.status < 300) {
    return json;
  } else {
    return json.then(error => Promise.reject(error));
  }
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

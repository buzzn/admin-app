import { put, call, take, fork, cancel } from 'redux-saga/effects';
import get from 'lodash/get';
import camelCase from 'lodash/camelCase';
import { logException } from '_util';
import { constants } from './actions';
import api from './api';

export function* validationRulesSagas({ apiUrl, apiPath, token }) {
  const { loadingList } = yield take(constants.SET_LOADING_LIST);
  try {
    const rulesList = yield call(api.fetchValidationRules, { apiUrl, apiPath, token });
    for (const module of loadingList) {
      const rawRules = get(rulesList.paths, module.swaggerPath);
      if (rawRules) {
        const validationRules = rawRules.filter(rule => rule.in === 'formData')
          .reduce((res, rule) => ({ ...res, [camelCase(rule.name)]: { ...rule } }), {});
        yield put(module.setAction(validationRules));
      }
    }
  } catch (error) {
    logException(error);
  }
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);

  while (true) {
    const sagas = yield fork(validationRulesSagas, { apiUrl, apiPath, token });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}

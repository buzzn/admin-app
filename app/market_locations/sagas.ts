import { put, call, takeLatest, take, fork, cancel, select } from 'redux-saga/effects';
import { logException } from '_util';
import { actions, constants } from './actions';
import api from './api';

export const selectLocationId = state => state.marketLocations.locationId;
export const selectGroupId = state => state.marketLocations.groupId;

export function* getMarketLocation({ apiUrl, apiPath, token }, { locationId, groupId }) {
  yield put(actions.loadingMarketLocation());
  try {
    const marketLocation = yield call(api.fetchMarketLocation, { apiUrl, apiPath, token, locationId, groupId });
    yield put(actions.setMarketLocation(marketLocation));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedMarketLocation());
}

export function* getMarketLocations({ apiUrl, apiPath, token }, { groupId }) {
  yield put(actions.loadingMarketLocations());
  try {
    const marketLocations = yield call(api.fetchMarketLocations, { apiUrl, apiPath, token, groupId });
    yield put(actions.setMarketLocations(marketLocations));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedMarketLocations());
}

export function* marketLocationsSagas({ apiUrl, apiPath, token }) {
  // @ts-ignore
  yield takeLatest(constants.LOAD_MARKET_LOCATIONS, getMarketLocations, { apiUrl, apiPath, token });
  // @ts-ignore
  yield takeLatest(constants.LOAD_MARKET_LOCATION, getMarketLocation, { apiUrl, apiPath, token });
  const locationId = yield select(selectLocationId);
  const groupId = yield select(selectGroupId);
  if (locationId) yield call(getMarketLocation, { apiUrl, apiPath, token }, { locationId, groupId });
  if (groupId) yield call(getMarketLocations, { apiUrl, apiPath, token }, { groupId });
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(marketLocationsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

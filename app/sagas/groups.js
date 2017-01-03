import { put, call } from 'redux-saga/effects';
import { actions } from '../actions';
import api from '../api';

export default function* ({ apiUrl, apiPath, token, userId }) {
  yield put(actions.setUserGroups([]));
  try {
    const userGroups = yield call(api.fetchUserGroups, { apiUrl, apiPath, token, userId });
    yield put(actions.setUserGroups(userGroups));
  } catch (error) {
    console.log(error);
  }
}

import { put, call } from 'redux-saga/effects';
import { actions } from '../actions';
import api from '../api';

export default function* ({ apiUrl, apiPath, token, userId }) {
  try {
    const userProfile = yield call(api.fetchUserProfile, { apiUrl, apiPath, token, userId });
    yield put(actions.setUserProfile(userProfile));
  } catch (error) {
    console.log(error);
  }
}

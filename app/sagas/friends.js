import { put, call } from 'redux-saga/effects';
import { actions } from '../actions';
import api from '../api';

export default function* ({ apiUrl, apiPath, token, userId }) {
  yield put(actions.setUserFriends([]));
  try {
    const userFriendsIds = yield call(api.fetchUserFriends, { apiUrl, apiPath, token, userId });
    const userFriends = [];
    // TODO: this can be moved to api
    for (let i = 0; i < userFriendsIds.length; i += 1) {
      const id = userFriendsIds[i].id;
      const profile = yield call(api.fetchUserProfile, { apiUrl, apiPath, token, userId: id });
      userFriends.push({ id, profile });
    }
    yield put(actions.setUserFriends(userFriends));
  } catch (error) {
    console.log(error);
  }
}

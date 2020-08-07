import { put, call, takeLatest, takeLeading, take, fork, cancel, select } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { logException, convertErrors } from '_util';
import { actions, constants } from './actions';
import api from './api';

export const selectIds = state => state.comments.ids;

const commentsFunctions = (type) => {
  const functionsObj = {
    group: {
      getComments: api.fetchGroupComments,
      addComment: api.addGroupComment,
      updateComment: api.updateGroupComment,
      deleteComment: api.deleteGroupComment,
    },
    contract: {
      getComments: api.fetchContractComments,
      addComment: api.addContractComment,
      updateComment: api.updateContractComment,
      deleteComment: api.deleteContractComment,
    },
    meter: {
      getComments: api.fetchMeterComments,
      addComment: api.addMeterComment,
      updateComment: api.updateMeterComment,
      deleteComment: api.deleteMeterComment,
    },
  };
  if (functionsObj[type]) return functionsObj[type];

  logException('Check comments action "ids" parameter. Type is wrong :)');
  return undefined;
};
// Proxies are not supported by IE11!
// const commentsFunctions = new Proxy(
//   {
//     group: {
//       getComments: api.fetchGroupComments,
//       addComment: api.addGroupComment,
//       updateComment: api.updateGroupComment,
//       deleteComment: api.deleteGroupComment,
//     },
//   },
//   {
//     get: (obj, prop) => {
//       if (prop in obj) return obj[prop];
//       logException('Check comments action "ids" parameter. Type is wrong :)');
//       return undefined;
//     },
//   },
// );

export function* getComments({ apiUrl, apiPath, token }, { ids: { type, ...restIds } }) {
  yield put(actions.loadingComments());
  try {
    const comments = yield call(commentsFunctions(type).getComments, { apiUrl, apiPath, token, ...restIds });
    yield put(actions.setComments(comments));
  } catch (error) {
    logException(error);
  }
  yield put(actions.loadedComments());
}

export function* addComment({ apiUrl, apiPath, token }, { params, resolve, reject, ids, ids: { type, ...restIds } }) {
  try {
    const res = yield call(commentsFunctions(type).addComment, { apiUrl, apiPath, token, params, ...restIds });
    if (res._error) {
      yield call(reject, new SubmissionError(convertErrors(res.errors)));
    } else {
      yield call(resolve, res);
      yield put(actions.loadComments(ids));
    }
  } catch (error) {
    logException(error);
  }
}

export function* updateComment(
  { apiUrl, apiPath, token },
  { params, resolve, reject, ids, ids: { type, ...restIds } },
) {
  try {
    const res = yield call(commentsFunctions(type).updateComment, { apiUrl, apiPath, token, params, ...restIds });
    if (res._error) {
      yield call(reject, new SubmissionError(convertErrors(res.errors)));
    } else {
      yield call(resolve, res);
      yield put(actions.loadComments(ids));
    }
  } catch (error) {
    logException(error);
  }
}

export function* deleteComment({ apiUrl, apiPath, token }, { ids, ids: { type, ...restIds } }) {
  try {
    yield call(commentsFunctions(type).deleteComment, { apiUrl, apiPath, token, ...restIds });
    yield put(actions.loadComments(ids));
  } catch (error) {
    logException(error);
  }
}

export function* commentsSagas({ apiUrl, apiPath, token }) {
  yield takeLatest(constants.LOAD_COMMENTS, getComments, { apiUrl, apiPath, token });
  yield takeLeading(constants.ADD_COMMENT, addComment, { apiUrl, apiPath, token });
  yield takeLeading(constants.UPDATE_COMMENT, updateComment, { apiUrl, apiPath, token });
  yield takeLeading(constants.DELETE_COMMENT, deleteComment, { apiUrl, apiPath, token });

  const ids = yield select(selectIds);
  if (Object.keys(ids).length) yield put(actions.loadComments(ids));
}

export default function* () {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);
  let sagas;

  while (true) {
    if (token) sagas = yield fork(commentsSagas, { apiUrl, apiPath, token });
    ({ token } = yield take(constants.SET_TOKEN));
    if (sagas) yield cancel(sagas);
  }
}

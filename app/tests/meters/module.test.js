import { expectSaga } from 'redux-saga-test-plan';
import reducer, { initialState } from 'meters/reducers';
import saga, { getMeter, getGroupMeters, addRealMeter, updateMeter, metersSagas } from 'meters/sagas';

// TODO: move to __mock__
jest.mock('_util', () => ({ logException: jest.fn() }));
jest.mock('meters/api');

const apiParams = { apiUrl: '', apiPath: '', token: '' };

it('fetches meter and stores it', () => expectSaga(getMeter, { ...apiParams }, { meterId: '', groupId: '' })
  .withReducer(reducer)
  .hasFinalState({ ...initialState })
  .run());

import { expectSaga } from 'redux-saga-test-plan';
import reducer, { initialState } from 'meters/reducers';
import saga, { getMeter, getGroupMeters, addRealMeter, updateMeter, metersSagas } from 'meters/sagas';
import api from 'meters/api';
import { actions } from 'meters/actions';

// TODO: move to __mock__
jest.mock('_util', () => ({ logException: jest.fn() }));
jest.mock('meters/api');

const apiParams = { apiUrl: '', apiPath: '', token: '' };

it('fetches meter and stores it', () => {
  const meter = { _status: 200, registers: {} };
  api.fetchMeter = jest.fn(() => (meter));
  return expectSaga(getMeter, { ...apiParams }, { meterId: '', groupId: '' })
    .put(actions.loadingMeter())
    .put(actions.setMeter(meter))
    .put(actions.loadedMeter())
    .withReducer(reducer)
    .hasFinalState({ ...initialState, meter, meterRegisters: {} })
    .run();
});

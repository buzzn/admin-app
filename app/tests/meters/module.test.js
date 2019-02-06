import { expectSaga } from 'redux-saga-test-plan';
import reducer, { initialState } from 'meters/reducers';
import saga, { getMeter, getGroupMeters, addRealMeter, updateMeter, metersSagas } from 'meters/sagas';
import api from 'meters/api';
import { actions } from 'meters/actions';
import { logException } from '_util';

// TODO: move to __mock__
jest.mock('_util', () => ({ logException: jest.fn() }));
jest.mock('meters/api');

const apiParams = { apiUrl: '', apiPath: '', token: '' };

describe('meters module', () => {
  it('fetches meter and stores it', () => {
    const meter = { _status: 200, registers: {} };
    api.fetchMeter = jest.fn(() => meter);
    return expectSaga(getMeter, { ...apiParams }, { meterId: '', groupId: '' })
      .put(actions.loadingMeter())
      .put(actions.setMeter(meter))
      .put(actions.loadedMeter())
      .withReducer(reducer)
      .hasFinalState({ ...initialState, meter, meterRegisters: {} })
      .run();
  });

  it('fails to fetch meter', async () => {
    logException.mockClear();
    api.fetchMeter = null;
    await expectSaga(getMeter, { ...apiParams }, { meterId: '', groupId: '' })
      .put(actions.loadingMeter())
      .put(actions.loadedMeter())
      .withReducer(reducer)
      .hasFinalState({ ...initialState })
      .run();
    expect(logException).toBeCalledTimes(1);
  });

  it('fetches group meters and stores them', () => {
    const groupMeters = { _status: 200, array: {} };
    api.fetchGroupMeters = jest.fn(() => groupMeters);
    return expectSaga(getGroupMeters, { ...apiParams }, { groupId: '' })
      .put(actions.loadingGroupMeters())
      .put(actions.setGroupMeters(groupMeters))
      .put(actions.loadedGroupMeters())
      .withReducer(reducer)
      .hasFinalState({ ...initialState, groupMeters })
      .run();
  });

  it('fails to fetch group meters', async () => {
    logException.mockClear();
    api.fetchGroupMeters = null;
    await expectSaga(getGroupMeters, { ...apiParams }, { groupId: '' })
      .put(actions.loadingGroupMeters())
      .put(actions.loadedGroupMeters())
      .withReducer(reducer)
      .hasFinalState({ ...initialState })
      .run();
    expect(logException).toBeCalledTimes(1);
  });

  it('updates meter and fetches group meters and meter', async () => {
    api.updateMeter = jest.fn(() => ({ _status: 200 }));
    const groupId = 'groupId';
    const meterId = 'meterId';
    const resolve = jest.fn();
    await expectSaga(updateMeter, { ...apiParams }, { meterId, params: {}, resolve, reject: null, groupId })
      .put(actions.loadGroupMeters(groupId))
      .put(actions.loadMeter({ meterId, groupId }))
      .run();
    expect(resolve).toBeCalledTimes(1);
    expect(resolve).toHaveBeenLastCalledWith({ _status: 200 });
  });

  it('updates meter with an err (api)', async () => {
    api.updateMeter = jest.fn(() => ({ _status: 200, _error: 'Error' }));
    const groupId = 'groupId';
    const meterId = 'meterId';
    const reject = jest.fn();
    await expectSaga(updateMeter, { ...apiParams }, { meterId, params: {}, resolve: null, reject, groupId }).run();
    expect(reject).toBeCalledTimes(1);
  });

  it('fails to update meter', async () => {
    logException.mockClear();
    api.updateMeter = null;
    await expectSaga(
      updateMeter,
      { ...apiParams },
      { meterId: '', params: {}, resolve: null, reject: null, groupId: '' },
    ).run();
    expect(logException).toBeCalledTimes(1);
  });
});

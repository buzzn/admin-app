import { expectSaga } from 'redux-saga-test-plan';
import reducer, { initialState } from 'readings/reducers';
import { addReading, deleteReading, getAutoReadingValue } from 'readings/sagas';
import api from 'readings/api';
import { actions } from 'readings/actions';
import { actions as billingsActions } from 'billings/actions';
import { actions as metersActions } from 'meters/actions';

import { logException } from '_util';

// TODO: move to __mock__
jest.mock('_util', () => ({ logException: jest.fn() }));
jest.mock('readings/api');

const apiParams = { apiUrl: '', apiPath: '', token: '' };

describe('readings module', () => {
  it('creates a reading', async () => {
    api.addReading = jest.fn(({ params }) => ({ _status: 201, ...params }));
    const groupId = 'groupId';
    const meterId = 'meterId';
    const resolve = jest.fn();
    const params = { date: '01.01.0101' };
    await expectSaga(addReading, { ...apiParams }, { meterId, registerId: '', params, resolve, reject: null, groupId })
      .put(metersActions.loadMeter({ groupId, meterId }))
      .run();
    expect(resolve).toHaveBeenCalledWith({ _status: 201, ...params });
  });

  it('creates an attached reading', async () => {
    api.addReading = jest.fn(({ params }) => ({ _status: 201, id: 1, ...params }));
    const groupId = 'groupId';
    const meterId = 'meterId';
    const billingItem = {
      begin: true,
      updatedAt: '01.01.0101',
      contractId: 'contractId',
      billingId: 'billingId',
      billingItemId: 'billingItemId',
    };
    const resolve = jest.fn();
    const params = { date: '01.01.0101' };
    await expectSaga(
      addReading,
      { ...apiParams },
      { meterId, registerId: '', params, resolve, reject: null, groupId, billingItem },
    )
      .put(
        billingsActions.attachReading({
          params: { ...params, beginReadingId: 1, updatedAt: billingItem.updatedAt },
          resolve,
          reject: null,
          groupId,
          contractId: billingItem.contractId,
          billingId: billingItem.billingId,
          billingItemId: billingItem.billingItemId,
        }),
      )
      .run();
    expect(resolve).toBeCalledTimes(0);
  });
});

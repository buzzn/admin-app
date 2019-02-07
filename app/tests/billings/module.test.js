import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import reducer, { initialState } from 'billings/reducers';
import {
  getBilling,
  getBillings,
  changeBilling,
  billingsSagas,
  selectGroupId,
  selectContractId,
  selectBillingId,
} from 'billings/sagas';
import api from 'billings/api';
import { actions } from 'billings/actions';
import { actions as contractActions } from 'contracts/actions';
import { logException } from '_util';

// TODO: move to __mock__
jest.mock('_util', () => ({ logException: jest.fn() }));
jest.mock('billings/api');

const apiParams = { apiUrl: '', apiPath: '', token: '' };

describe('billings module', () => {
  it('fetches billing and stores it', () => {
    const billing = { _status: 200 };
    api.fetchBilling = jest.fn(() => billing);
    return expectSaga(getBilling, { ...apiParams }, { billingId: '', groupId: '', contractId: '' })
      .put(actions.loadingBilling())
      .put(actions.setBilling({ billing }))
      .put(actions.loadedBilling())
      .withReducer(reducer)
      .hasFinalState({ ...initialState, billing })
      .run();
  });

  it('fails to fetch billing', async () => {
    logException.mockClear();
    api.fetchBilling = null;
    await expectSaga(getBilling, { ...apiParams }, { billingId: '', groupId: '', contractId: '' })
      .put(actions.loadingBilling())
      .put(actions.loadedBilling())
      .withReducer(reducer)
      .hasFinalState({ ...initialState })
      .run();
    expect(logException).toBeCalledTimes(1);
  });

  it('fetches contract billings and stores them', () => {
    const billings = { _status: 200, array: [] };
    api.fetchBillings = jest.fn(() => billings);
    return expectSaga(getBillings, { ...apiParams }, { groupId: '', contractId: '' })
      .put(actions.loadingBillings())
      .put(actions.setBillings(billings))
      .put(actions.loadedBillings())
      .withReducer(reducer)
      .hasFinalState({ ...initialState, billings })
      .run();
  });

  it('fails to fetch contract billings', async () => {
    logException.mockClear();
    api.fetchBillings = null;
    await expectSaga(getBillings, { ...apiParams }, { groupId: '', contractId: '' })
      .put(actions.loadingBillings())
      .put(actions.loadedBillings())
      .withReducer(reducer)
      .hasFinalState({ ...initialState })
      .run();
    expect(logException).toBeCalledTimes(1);
  });

  it('creates billing and fetches contract billings and group powertakers with billings', async () => {
    api.addBilling = jest.fn(({ params }) => ({ _status: 201, ...params }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const resolve = jest.fn();
    const params = { beginDate: '01.01.0101' };
    await expectSaga(
      changeBilling,
      { ...apiParams, type: 'add' },
      { resolve, reject: null, params, groupId, contractId },
    )
      .put(actions.loadBillings({ groupId, contractId }))
      .put(contractActions.loadGroupPowertakers({ groupId, withBillings: true }))
      .run();
    expect(resolve).toBeCalledTimes(1);
    expect(resolve).toHaveBeenLastCalledWith({ _status: 201, ...params });
  });

  it('updates billing and fetches contract billings and group powertakers with billings', async () => {
    api.updateBilling = jest.fn(({ params }) => ({ _status: 200, ...params }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const resolve = jest.fn();
    const params = { beginDate: '01.01.0101' };
    await expectSaga(
      changeBilling,
      { ...apiParams, type: 'update' },
      { resolve, reject: null, params, groupId, contractId },
    )
      .put(actions.loadBillings({ groupId, contractId }))
      .put(contractActions.loadGroupPowertakers({ groupId, withBillings: true }))
      .run();
    expect(resolve).toBeCalledTimes(1);
    expect(resolve).toHaveBeenLastCalledWith({ _status: 200, ...params });
  });

  it('attaches a reading to the billing and fetches contract billings and group powertakers with billings', async () => {
    api.attachReading = jest.fn(({ params }) => ({ _status: 200, ...params }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const resolve = jest.fn();
    const params = { beginDate: '01.01.0101' };
    await expectSaga(
      changeBilling,
      { ...apiParams, type: 'attachReading' },
      { resolve, reject: null, params, groupId, contractId },
    )
      .put(actions.loadBillings({ groupId, contractId }))
      .put(contractActions.loadGroupPowertakers({ groupId, withBillings: true }))
      .run();
    expect(resolve).toBeCalledTimes(1);
    expect(resolve).toHaveBeenLastCalledWith({ _status: 200, ...params });
  });

  it('change billing with api err', async () => {
    api.addBilling = jest.fn(() => ({ _status: 422, _error: 'Error' }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const reject = jest.fn();
    await expectSaga(
      changeBilling,
      { ...apiParams, type: 'add' },
      { resolve: null, reject, params: {}, groupId, contractId },
    ).run();
    expect(reject).toBeCalledTimes(1);
  });

  it('change billing fails', async () => {
    logException.mockClear();
    api.addBilling = null;
    const groupId = 'groupId';
    const contractId = 'contractId';
    await expectSaga(
      changeBilling,
      { ...apiParams, type: 'add' },
      { resolve: null, reject: null, params: {}, groupId, contractId },
    ).run();
    expect(logException).toBeCalledTimes(1);
  });

  it('loads initial data', () => {
    const groupId = 'groupId';
    const contractId = 'contractId';
    const billingId = 'billingId';
    return expectSaga(billingsSagas, { ...apiParams })
      .provide([
        [select(selectGroupId), groupId],
        [select(selectContractId), contractId],
        [select(selectBillingId), billingId],
      ])
      .put(actions.loadBilling({ groupId, contractId, billingId }))
      .put(actions.loadBillings({ groupId, contractId }))
      .silentRun();
  });

  it('listens for actions', async () => {
    const billings = { _status: 200, array: [] };
    api.fetchBillings = jest.fn(() => billings);

    const billing = { _status: 200 };
    api.fetchBilling = jest.fn(() => billing);

    const newBillingResolve = jest.fn();
    const newBillingParams = { beginDate: '01.01.0101' };
    const newBillingRes = { ...newBillingParams, _status: 201 };
    api.addBilling = jest.fn(() => newBillingRes);

    const updateBillingResolve = jest.fn();
    const updateBillingParams = { beginDate: '01.01.0101' };
    const updateBillingRes = { ...updateBillingParams, _status: 200 };
    api.updateBilling = jest.fn(() => updateBillingRes);

    const attachReadingResolve = jest.fn();
    const attachReadingParams = { beginDate: '01.01.0101' };
    const attachReadingRes = { ...attachReadingParams, _status: 200 };
    api.attachReading = jest.fn(() => attachReadingRes);

    const groupId = '';
    const contractId = '';
    const billingId = '';

    await expectSaga(billingsSagas, { ...apiParams })
      .withReducer(reducer)
      .hasFinalState({ ...initialState, groupId, contractId, billingId, billings, billing })
      .dispatch(actions.loadBillings({ groupId, contractId }))
      .dispatch(actions.loadBilling({ groupId, contractId, billingId }))
      .dispatch(
        actions.addBilling({ params: newBillingParams, resolve: newBillingResolve, reject: null, groupId, contractId }),
      )
      .dispatch(
        actions.updateBilling({
          params: updateBillingParams,
          resolve: updateBillingResolve,
          reject: null,
          groupId,
          contractId,
          billingId,
        }),
      )
      .dispatch(
        actions.attachReading({
          params: attachReadingParams,
          resolve: attachReadingResolve,
          reject: null,
          groupId,
          contractId,
          billingId,
          billingItemId: 'itemId',
        }),
      )
      .silentRun();
    expect(newBillingResolve).toHaveBeenCalledWith(newBillingRes);
    expect(updateBillingResolve).toHaveBeenCalledWith(updateBillingRes);
    expect(attachReadingResolve).toHaveBeenCalledWith(attachReadingRes);
  });
});

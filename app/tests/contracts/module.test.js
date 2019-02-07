import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import reducer, { initialState } from 'contracts/reducers';
import {
  getContract,
  getContractBalanceSheet,
  getContractPayments,
  updateBankAccount,
  getGroupContracts,
  getPowertakers,
  addContract,
  addPayment,
  updatePayment,
  deletePayment,
  updateContract,
  attachContractPDF,
  generateContractPDF,
  deleteContractPDF,
  contractSagas,
  selectGroup,
  selectWithBillings,
  selectContractId,
} from 'contracts/sagas';
import api from 'contracts/api';
import { actions } from 'contracts/actions';
import { actions as groupActions } from 'groups/actions';
import { logException } from '_util';

// TODO: move to __mock__
jest.mock('_util', () => ({ logException: jest.fn() }));
jest.mock('contracts/api');

const apiParams = { apiUrl: '', apiPath: '', token: '' };

describe('contracts module', () => {
  it('fetches contract and stores it', () => {
    const contract = { _status: 200, contractor: {}, customer: {} };
    api.fetchContract = jest.fn(() => contract);
    return expectSaga(getContract, { ...apiParams }, { groupId: '', contractId: '' })
      .put(actions.loadingContract())
      .put(actions.setContract({ contract, contractor: contract.contractor, customer: contract.customer }))
      .put(actions.loadedContract())
      .withReducer(reducer)
      .hasFinalState({ ...initialState, contract, contractor: contract.contractor, customer: contract.customer })
      .run();
  });

  it('fetches LPT contract with tariffs and stores it', () => {
    const contract = { _status: 200, contractor: {}, customer: {}, type: 'contract_localpool_power_taker' };
    api.fetchContract = jest.fn(() => contract);
    const tariffs = { _status: 200, array: [] };
    api.fetchContractTariffs = jest.fn(() => tariffs);
    return expectSaga(getContract, { ...apiParams }, { groupId: '', contractId: '' })
      .put(actions.loadingContract())
      .put(actions.setContract({ contract, contractor: contract.contractor, customer: contract.customer }))
      .put(actions.loadedContract())
      .withReducer(reducer)
      .hasFinalState({
        ...initialState,
        contract: { ...contract, tariffs },
        contractor: contract.contractor,
        customer: contract.customer,
      })
      .run();
  });

  it('fails to fetch contract', async () => {
    logException.mockClear();
    api.fetchContract = null;
    await expectSaga(getContract, { ...apiParams }, { groupId: '', contractId: '' })
      .put(actions.loadingContract())
      .put(actions.loadedContract())
      .withReducer(reducer)
      .hasFinalState({ ...initialState })
      .run();
    expect(logException).toBeCalledTimes(1);
  });

  it('fetches contract balance sheet', () => {
    const balanceSheet = { _status: 200 };
    api.fetchContractBalanceSheet = jest.fn(() => balanceSheet);
    return expectSaga(getContractBalanceSheet, { ...apiParams }, { groupId: '', contractId: '' })
      .put(actions.loadingContractBalanceSheet())
      .put(actions.setContractBalanceSheet(balanceSheet))
      .put(actions.loadedContractBalanceSheet())
      .withReducer(reducer)
      .hasFinalState({ ...initialState, balanceSheet })
      .run();
  });

  it('fails to fetch contract balance sheet', async () => {
    logException.mockClear();
    api.fetchContractBalanceSheet = null;
    await expectSaga(getContractBalanceSheet, { ...apiParams }, { groupId: '', contractId: '' })
      .put(actions.loadingContractBalanceSheet())
      .put(actions.loadedContractBalanceSheet())
      .withReducer(reducer)
      .hasFinalState({ ...initialState })
      .run();
    expect(logException).toBeCalledTimes(1);
  });

  it('fetches contract payments', () => {
    const payments = { _status: 200, array: [] };
    api.fetchContractPayments = jest.fn(() => payments);
    return expectSaga(getContractPayments, { ...apiParams }, { groupId: '', contractId: '' })
      .put(actions.loadingContractPayments())
      .put(actions.setContractPayments(payments))
      .put(actions.loadedContractPayments())
      .withReducer(reducer)
      .hasFinalState({ ...initialState, payments })
      .run();
  });

  it('fails to fetch contract payments', async () => {
    logException.mockClear();
    api.fetchContractPayments = null;
    await expectSaga(getContractPayments, { ...apiParams }, { groupId: '', contractId: '' })
      .put(actions.loadingContractPayments())
      .put(actions.loadedContractPayments())
      .withReducer(reducer)
      .hasFinalState({ ...initialState })
      .run();
    expect(logException).toBeCalledTimes(1);
  });

  it('updates bank account for the contract', async () => {
    api.updateBankAccount = jest.fn(({ params }) => ({ _status: 200, ...params }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const resolve = jest.fn();
    const params = { iban: '123' };
    await expectSaga(
      updateBankAccount,
      { ...apiParams },
      {
        bankAccountId: '',
        params,
        resolve,
        reject: null,
        groupId,
        partyId: '',
        partyType: '',
      },
    )
      .provide([[select(selectContractId), contractId]])
      .put(actions.loadContract({ contractId, groupId }))
      .run();
    expect(resolve).toBeCalledTimes(1);
    expect(resolve).toHaveBeenCalledWith({ _status: 200, ...params });
  });

  it('fails to update bank account (api err)', async () => {
    api.updateBankAccount = jest.fn(() => ({ _status: 422, _error: 'Error' }));
    const reject = jest.fn();
    await expectSaga(
      updateBankAccount,
      { ...apiParams },
      {
        bankAccountId: '',
        params: {},
        resolve: null,
        reject,
        groupId: '',
        partyId: '',
        partyType: '',
      },
    ).run();
    expect(reject).toBeCalledTimes(1);
  });

  it('fails to update bank account', async () => {
    logException.mockClear();
    api.updateBankAccount = null;
    await expectSaga(
      updateBankAccount,
      { ...apiParams },
      {
        bankAccountId: '',
        params: {},
        resolve: null,
        reject: null,
        groupId: '',
        partyId: '',
        partyType: '',
      },
    ).run();
    expect(logException).toBeCalledTimes(1);
  });

  it('fetches contracts and stores them', () => {
    const groupContracts = { _status: 200, array: [] };
    api.fetchGroupContracts = jest.fn(() => groupContracts);
    return expectSaga(getGroupContracts, { ...apiParams }, { groupId: '' })
      .put(actions.loadingGroupContracts())
      .put(actions.setGroupContracts(groupContracts.array))
      .put(actions.loadedGroupContracts())
      .withReducer(reducer)
      .hasFinalState({ ...initialState, groupContracts: groupContracts.array })
      .run();
  });

  it('fails to fetch contracts', async () => {
    logException.mockClear();
    api.fetchGroupContracts = null;
    await expectSaga(getGroupContracts, { ...apiParams }, { groupId: '' })
      .put(actions.loadingGroupContracts())
      .put(actions.loadedGroupContracts())
      .withReducer(reducer)
      .hasFinalState({ ...initialState })
      .run();
    expect(logException).toBeCalledTimes(1);
  });

  it('fetches powertakers without billings and stores them', () => {
    const groupPowertakers = { _status: 200, array: [] };
    api.fetchGroupPowertakers = jest.fn(() => groupPowertakers);
    return expectSaga(getPowertakers, { ...apiParams }, { groupId: '', selectWithBillings: false })
      .put(actions.loadingGroupPowertakers())
      .put(actions.setGroupPowertakers(groupPowertakers))
      .put(actions.loadedGroupPowertakers())
      .withReducer(reducer)
      .hasFinalState({ ...initialState, groupPowertakers })
      .run();
  });

  it('fetches powertakers with billings and stores them', () => {
    const groupPowertakers = { _status: 200, array: [] };
    api.fetchGroupPowertakersWithBillings = jest.fn(() => groupPowertakers);
    return expectSaga(getPowertakers, { ...apiParams }, { groupId: '', selectWithBillings: true })
      .put(actions.loadingGroupPowertakers())
      .put(actions.setGroupPowertakers(groupPowertakers))
      .put(actions.loadedGroupPowertakers())
      .withReducer(reducer)
      .hasFinalState({ ...initialState, groupPowertakers })
      .run();
  });

  it('fails to fetch powertakers', async () => {
    logException.mockClear();
    api.fetchGroupPowertakers = null;
    await expectSaga(getPowertakers, { ...apiParams }, { groupId: '', selectWithBillings: false })
      .put(actions.loadingGroupPowertakers())
      .put(actions.loadedGroupPowertakers())
      .withReducer(reducer)
      .hasFinalState({ ...initialState })
      .run();
    expect(logException).toBeCalledTimes(1);
  });

  it('creates a contract', async () => {
    api.addContract = jest.fn(({ params }) => ({ _status: 201, ...params }));
    const groupId = 'groupId';
    const resolve = jest.fn();
    const params = { beginDate: '01.01.0101' };
    await expectSaga(addContract, { ...apiParams }, { params, resolve, reject: null, groupId })
      .put(groupActions.loadGroup(groupId))
      .put(actions.loadGroupContracts(groupId))
      .put(actions.loadGroupPowertakers({ groupId }))
      .run();
    expect(resolve).toHaveBeenCalledWith({ _status: 201, ...params });
  });

  it('fails to create a contract (api)', async () => {
    api.addContract = jest.fn(() => ({ _status: 422, _error: 'Error' }));
    const reject = jest.fn();
    await expectSaga(addContract, { ...apiParams }, { params: {}, resolve: null, reject, groupId: '' }).run();
    expect(reject).toBeCalledTimes(1);
  });

  it('fails to create a contract', async () => {
    logException.mockClear();
    api.addContract = null;
    await expectSaga(addContract, { ...apiParams }, { params: {}, resolve: null, reject: null, groupId: '' }).run();
    expect(logException).toBeCalledTimes(1);
  });

  it('creates a payment', async () => {
    api.addPayment = jest.fn(({ params }) => ({ _status: 201, ...params }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const params = { amount: '10' };
    const resolve = jest.fn();
    await expectSaga(addPayment, { ...apiParams }, { params, resolve, reject: null, groupId, contractId })
      .put(actions.loadContractPayments({ groupId, contractId }))
      .run();
    expect(resolve).toHaveBeenCalledWith({ _status: 201, ...params });
  });

  it('fails to create a payment (api)', async () => {
    api.addPayment = jest.fn(() => ({ _status: 422, _error: 'Error' }));
    const reject = jest.fn();
    await expectSaga(
      addPayment,
      { ...apiParams },
      { params: {}, resolve: null, reject, groupId: '', contractId: '' },
    ).run();
    expect(reject).toBeCalledTimes(1);
  });

  it('fails to create a payment', async () => {
    logException.mockClear();
    api.addPayment = null;
    await expectSaga(
      addPayment,
      { ...apiParams },
      { params: {}, resolve: null, reject: null, groupId: '', contractId: '' },
    ).run();
    expect(logException).toBeCalledTimes(1);
  });

  it('updates a payment', async () => {
    api.updatePayment = jest.fn(({ params }) => ({ _status: 200, ...params }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const params = { amount: '10' };
    const resolve = jest.fn();
    await expectSaga(
      updatePayment,
      { ...apiParams },
      { params, resolve, reject: null, groupId, contractId, paymentId: '' },
    )
      .put(actions.loadContractPayments({ groupId, contractId }))
      .run();
    expect(resolve).toHaveBeenCalledWith({ _status: 200, ...params });
  });

  it('fails to update a payment (api)', async () => {
    api.updatePayment = jest.fn(() => ({ _status: 422, _error: 'Error' }));
    const reject = jest.fn();
    await expectSaga(
      updatePayment,
      { ...apiParams },
      { params: {}, resolve: null, reject, groupId: '', contractId: '', paymentId: '' },
    ).run();
    expect(reject).toBeCalledTimes(1);
  });

  it('fails to update a payment', async () => {
    logException.mockClear();
    api.updatePayment = null;
    await expectSaga(
      updatePayment,
      { ...apiParams },
      { params: {}, resolve: null, reject: null, groupId: '', contractId: '', paymentId: '' },
    ).run();
    expect(logException).toBeCalledTimes(1);
  });

  it('deletes a payment', () => {
    api.deletePayment = jest.fn(() => ({ _status: 200 }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    return expectSaga(deletePayment, { ...apiParams }, { groupId, contractId, paymentId: '' })
      .put(actions.loadContractPayments({ groupId, contractId }))
      .run();
  });

  it('fails to delete a payment', async () => {
    logException.mockClear();
    api.deletePayment = null;
    await expectSaga(deletePayment, { ...apiParams }, { groupId: '', contractId: '', paymentId: '' }).run();
    expect(logException).toBeCalledTimes(1);
  });
});

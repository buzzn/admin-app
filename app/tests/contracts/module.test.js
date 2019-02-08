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
    return expectSaga(getPowertakers, { ...apiParams }, { groupId: '', withBillings: false })
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
    return expectSaga(getPowertakers, { ...apiParams }, { groupId: '', withBillings: true })
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
    await expectSaga(getPowertakers, { ...apiParams }, { groupId: '', withBillings: false })
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

  it('updates a contract', async () => {
    api.updateContract = jest.fn(({ params }) => ({ _status: 200, ...params }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const resolve = jest.fn();
    const params = { beginDate: '01.01.0101' };
    await expectSaga(
      updateContract,
      { ...apiParams },
      { params, resolve, reject: null, groupId, contractId, updateType: 'contract' },
    )
      .put(actions.loadContract({ groupId, contractId }))
      .run();
    expect(resolve).toBeCalledWith({ _status: 200, ...params });
  });

  it('updates an org customer', async () => {
    api.updateOrganizationCustomer = jest.fn(({ params }) => ({ _status: 200, ...params }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const resolve = jest.fn();
    const params = { name: 'name' };
    await expectSaga(
      updateContract,
      { ...apiParams },
      { params, resolve, reject: null, groupId, contractId, updateType: 'organizationCustomer' },
    )
      .put(actions.loadContract({ groupId, contractId }))
      .run();
    expect(resolve).toBeCalledWith({ _status: 200, ...params });
  });

  it('updates a person customer', async () => {
    api.updatePersonCustomer = jest.fn(({ params }) => ({ _status: 200, ...params }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const resolve = jest.fn();
    const params = { firstName: 'name' };
    await expectSaga(
      updateContract,
      { ...apiParams },
      { params, resolve, reject: null, groupId, contractId, updateType: 'personCustomer' },
    )
      .put(actions.loadContract({ groupId, contractId }))
      .run();
    expect(resolve).toBeCalledWith({ _status: 200, ...params });
  });

  it('updates tariffs', async () => {
    api.updateContractTariffs = jest.fn(({ params }) => ({ _status: 200, ...params }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const resolve = jest.fn();
    const params = { ids: [] };
    await expectSaga(
      updateContract,
      { ...apiParams },
      { params, resolve, reject: null, groupId, contractId, updateType: 'tariffs' },
    )
      .put(actions.loadContract({ groupId, contractId }))
      .run();
    expect(resolve).toBeCalledWith({ _status: 200, ...params });
  });

  it('updates account', async () => {
    api.updateContractAccount = jest.fn(({ params }) => ({ _status: 200, ...params }));
    const groupId = 'groupId';
    const contractId = 'contractId';
    const resolve = jest.fn();
    const params = { balance: 500 };
    await expectSaga(
      updateContract,
      { ...apiParams },
      { params, resolve, reject: null, groupId, contractId, updateType: 'account' },
    )
      .put(actions.loadContract({ groupId, contractId }))
      .put(actions.loadContractBalanceSheet({ groupId, contractId }))
      .run();
    expect(resolve).toBeCalledWith({ _status: 200, ...params });
  });

  it('contract update api err', async () => {
    api.updateContract = jest.fn(() => ({ _status: 422, _error: 'Error' }));
    const reject = jest.fn();
    await expectSaga(
      updateContract,
      { ...apiParams },
      { params: {}, resolve: null, reject, groupId: '', contractId: '', updateType: 'contract' },
    ).run();
    expect(reject).toBeCalledTimes(1);
  });

  it('contract update fails', async () => {
    logException.mockClear();
    api.updateContract = null;
    await expectSaga(
      updateContract,
      { ...apiParams },
      { params: {}, resolve: null, reject: null, groupId: '', contractId: '', updateType: 'contract' },
    ).run();
    expect(logException).toBeCalledTimes(1);
  });

  it('attaches PDF to the contract', async () => {
    api.attachContractPDF = jest.fn(() => ({ _status: 200 }));
    const resolve = jest.fn();
    await expectSaga(
      attachContractPDF,
      { ...apiParams },
      { params: {}, groupId: '', contractId: '', resolve, reject: null },
    ).run();
    expect(resolve).toBeCalledTimes(1);
  });

  it('fails to attach PDF (api)', async () => {
    api.attachContractPDF = jest.fn(() => ({ _status: 422 }));
    const reject = jest.fn();
    await expectSaga(
      attachContractPDF,
      { ...apiParams },
      { params: {}, groupId: '', contractId: '', resolve: null, reject },
    ).run();
    expect(reject).toHaveBeenCalledWith(422);
  });

  it('fails to attach PDF', async () => {
    api.attachContractPDF = null;
    const reject = jest.fn();
    await expectSaga(
      attachContractPDF,
      { ...apiParams },
      { params: {}, groupId: '', contractId: '', resolve: null, reject },
    ).run();
    expect(reject).toBeCalledTimes(1);
  });

  it('generates contract PDF', async () => {
    api.generateContractPDF = jest.fn(() => ({ _status: 200 }));
    const resolve = jest.fn();
    await expectSaga(
      generateContractPDF,
      { ...apiParams },
      { groupId: '', contractId: '', resolve, reject: null },
    ).run();
    expect(resolve).toBeCalledTimes(1);
  });

  it('fails to generate PDF (api)', async () => {
    api.generateContractPDF = jest.fn(() => ({ _status: 422 }));
    const reject = jest.fn();
    await expectSaga(
      generateContractPDF,
      { ...apiParams },
      { groupId: '', contractId: '', resolve: null, reject },
    ).run();
    expect(reject).toHaveBeenCalledWith(422);
  });

  it('fails to generate PDF', async () => {
    api.generateContractPDF = null;
    const reject = jest.fn();
    await expectSaga(
      generateContractPDF,
      { ...apiParams },
      { groupId: '', contractId: '', resolve: null, reject },
    ).run();
    expect(reject).toBeCalledTimes(1);
  });

  it('deletes contract PDF', async () => {
    api.deleteContractPDF = jest.fn(() => ({ _status: 200 }));
    const resolve = jest.fn();
    await expectSaga(
      deleteContractPDF,
      { ...apiParams },
      { documentId: '', groupId: '', contractId: '', resolve, reject: null },
    ).run();
    expect(resolve).toBeCalledTimes(1);
  });

  it('fails to delete PDF', async () => {
    api.deleteContractPDF = null;
    const reject = jest.fn();
    await expectSaga(
      deleteContractPDF,
      { ...apiParams },
      { documentId: '', groupId: '', contractId: '', resolve: null, reject },
    ).run();
    expect(reject).toBeCalledTimes(1);
  });

  it('loads initial data', () => {
    const groupId = 'groupId';
    const contractId = 'contractId';
    const withBillings = true;
    return expectSaga(contractSagas, { ...apiParams })
      .provide([
        [select(selectGroup), groupId],
        [select(selectContractId), contractId],
        [select(selectWithBillings), withBillings],
      ])
      .put(actions.loadGroupContracts(groupId))
      .put(actions.loadGroupPowertakers({ groupId, withBillings }))
      .put(actions.loadContract({ groupId, contractId }))
      .put(actions.loadContractBalanceSheet({ groupId, contractId }))
      .put(actions.loadContractPayments({ groupId, contractId }))
      .silentRun();
  });

  it('listens for actions', async () => {
    const groupContracts = { _status: 200, array: [] };
    api.fetchGroupContracts = jest.fn(() => groupContracts);

    const contract = { _status: 200, contractor: {}, customer: {} };
    api.fetchContract = jest.fn(() => contract);

    const balanceSheet = { _status: 200 };
    api.fetchContractBalanceSheet = jest.fn(() => balanceSheet);

    const payments = { _status: 200, array: [] };
    api.fetchContractPayments = jest.fn(() => payments);

    const updateBankResolve = jest.fn();
    const updateBankParams = { balance: 500 };
    const updateBankRes = { ...updateBankParams, _status: 200 };
    api.updateBankAccount = jest.fn(() => updateBankRes);

    const groupPowertakers = { _status: 200, array: [] };
    api.fetchGroupPowertakersWithBillings = jest.fn(() => groupPowertakers);

    const addContractResolve = jest.fn();
    const addContractParams = { beginDate: '01.01.0101' };
    const addContractRes = { ...addContractParams, _status: 201 };
    api.addContract = jest.fn(() => addContractRes);

    const updateContractResolve = jest.fn();
    const updateContractParams = { beginDate: '01.01.0101' };
    const updateContractRes = { ...updateContractParams, _status: 200 };
    api.updateContract = jest.fn(() => updateContractRes);

    const addPaymentResolve = jest.fn();
    const addPaymentParams = { balance: 500 };
    const addPaymentRes = { ...addPaymentParams, _status: 201 };
    api.addPayment = jest.fn(() => addPaymentRes);

    const updatePaymentResolve = jest.fn();
    const updatePaymentParams = { balance: 500 };
    const updatePaymentRes = { ...updatePaymentParams, _status: 200 };
    api.updatePayment = jest.fn(() => updatePaymentRes);

    api.deletePayment = jest.fn();

    const attachPDFResolve = jest.fn();
    api.attachContractPDF = jest.fn(() => ({ _status: 200 }));

    const generatePDFResolve = jest.fn();
    api.generateContractPDF = jest.fn(() => ({ _status: 200 }));

    const deletePDFResolve = jest.fn();
    api.deleteContractPDF = jest.fn(() => ({ _status: 200 }));

    const groupId = '';
    const contractId = '';
    const withBillings = true;

    await expectSaga(contractSagas, { ...apiParams })
      .withReducer(reducer)
      .hasFinalState({
        ...initialState,
        groupContracts: groupContracts.array,
        contract,
        balanceSheet,
        payments,
        groupPowertakers,
        contractor: contract.contractor,
        customer: contract.customer,
        groupId,
        contractId,
        withBillings: undefined,
      })
      .provide([
        [select(selectGroup), groupId],
        [select(selectContractId), contractId],
        [select(selectWithBillings), withBillings],
      ])
      .dispatch(actions.loadGroupContracts(groupId))
      .dispatch(actions.loadContract({ groupId, contractId }))
      .dispatch(actions.loadContractBalanceSheet({ groupId, contractId }))
      .dispatch(actions.loadContractPayments({ groupId, contractId }))
      .dispatch(
        actions.updateBankAccount({
          bankAccountId: '',
          params: updateBankParams,
          resolve: updateBankResolve,
          reject: null,
          groupId,
          partyId: '',
          partyType: '',
        }),
      )
      .dispatch(actions.loadGroupPowertakers({ groupId, withBillings }))
      .dispatch(actions.addContract({ params: addContractParams, resolve: addContractResolve, reject: null, groupId }))
      .dispatch(
        actions.updateContract({
          params: updateContractParams,
          resolve: updateContractResolve,
          reject: null,
          groupId,
          contractId,
          updateType: 'contract',
        }),
      )
      .dispatch(
        actions.addPayment({ params: addPaymentParams, resolve: addPaymentResolve, reject: null, groupId, contractId }),
      )
      .dispatch(
        actions.updatePayment({
          params: updatePaymentParams,
          resolve: updatePaymentResolve,
          reject: null,
          groupId,
          contractId,
          paymentId: '',
        }),
      )
      .dispatch(actions.deletePayment({ groupId, contractId, paymentId: '' }))
      .dispatch(
        actions.attachContractPDF({
          params: {},
          groupId: '',
          contractId: '',
          resolve: attachPDFResolve,
          reject: null,
        }),
      )
      .dispatch(actions.generateContractPDF({ groupId: '', contractId: '', resolve: generatePDFResolve, reject: null }))
      .dispatch(
        actions.deleteContractPDF({
          documentId: '',
          groupId: '',
          contractId: '',
          resolve: deletePDFResolve,
          reject: null,
        }),
      )
      .silentRun();
    expect(updateBankResolve).toHaveBeenCalledWith(updateBankRes);
    expect(addContractResolve).toHaveBeenCalledWith(addContractRes);
    expect(updateContractResolve).toHaveBeenCalledWith(updateContractRes);
    expect(addPaymentResolve).toHaveBeenCalledWith(addPaymentRes);
    expect(updatePaymentResolve).toHaveBeenCalledWith(updatePaymentRes);
    expect(attachPDFResolve).toBeCalledTimes(1);
    expect(generatePDFResolve).toBeCalledTimes(1);
    expect(deletePDFResolve).toBeCalledTimes(1);
  });
});

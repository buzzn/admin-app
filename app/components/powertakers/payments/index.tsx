import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import get from 'lodash/get';
import Contracts from 'contracts';
import Loading from 'components/loading';
import Balance from './balance';
import PaymentsList from './payments';
import BankAccount from './bank_account';

const Payments = ({
  url,
  groupId,
  contractId,
  loading,
  contract,
  balanceSheet,
  payments,
  loadContract,
  loadContractBalanceSheet,
  setContractBalanceSheet,
  loadContractPayments,
  setContractPayments,
  updateContract,
  addPayment,
  updatePayment,
  deletePayment,
  validationRules,
  attachBankAccount,
}) => {
  useEffect(() => {
    loadContract({ groupId, contractId });
    loadContractBalanceSheet({ groupId, contractId });
    loadContractPayments({ groupId, contractId });
    return () => {
      setContractBalanceSheet({ _status: null });
      setContractPayments({ _status: null, array: [] });
    };
  }, [groupId, contractId]);

  if (loading || balanceSheet._status === null || payments._status === null || contract._status === null) return <Loading minHeight={40} />;
  if (
    (balanceSheet._status && balanceSheet._status !== 200)
    || (payments._status && payments._status !== 200)
    || (contract._status && contract._status !== 200)
  ) return <Redirect to={url} />;

  const customerBankAccount = get(contract, 'customerBankAccount') || {};
  const customerBankAccounts = get(contract.customer, 'bankAccounts.array', []).filter(b => b.id !== customerBankAccount.id);

  const contractorBankAccount = get(contract, 'contractorBankAccount') || {};
  const contractorBankAccounts = get(contract.contractor, 'bankAccounts.array', []).filter(b => b.id !== contractorBankAccount.id);

  return (
    <React.Fragment>
      <BankAccount
        {...{
          title: 'Customer bank account',
          bankAccount: customerBankAccount,
          bankAccounts: customerBankAccounts,
          attachBankAccount,
          groupId,
          contractId,
          loadContract,
          updatedAt: contract.updatedAt,
          reloadCb: () => loadContract({ groupId, contractId}),
          partyType: 'customer',
        }}
      />
      <br />
      <hr />
      <BankAccount
        {...{
          title: 'Contractor bank account',
          bankAccount: contractorBankAccount,
          bankAccounts: contractorBankAccounts,
          attachBankAccount,
          groupId,
          contractId,
          loadContract,
          updatedAt: contract.updatedAt,
          reloadCb: () => loadContract({ groupId, contractId}),
          partyType: 'contractor',
        }}
      />
      <Balance
        {...{
          balanceSheet,
          groupId,
          contractId,
          updateContract: ({ resolve, reject, params }) => updateContract({
            resolve,
            reject,
            params: { ...params, updatedAt: contract.updatedAt },
            groupId,
            contractId,
            updateType: 'account',
          }),
        }}
      />
      <PaymentsList
        {...{
          payments: payments.array,
          tariffs: contract.tariffs.array,
          addPayment,
          updatePayment,
          deletePayment,
          groupId,
          contractId,
          validationRules,
        }}
      />
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    loading:
      state.contracts.loadingContractBalanceSheet
      || state.contracts.loadingContractPayments
      || state.contracts.loadContract,
    contract: state.contracts.contract,
    balanceSheet: state.contracts.balanceSheet,
    payments: state.contracts.payments,
    validationRules: state.contracts.validationRules,
  };
}

export default connect(
  mapStateToProps,
  {
    loadContract: Contracts.actions.loadContract,
    loadContractBalanceSheet: Contracts.actions.loadContractBalanceSheet,
    setContractBalanceSheet: Contracts.actions.setContractBalanceSheet,
    loadContractPayments: Contracts.actions.loadContractPayments,
    setContractPayments: Contracts.actions.setContractPayments,
    updateContract: Contracts.actions.updateContract,
    addPayment: Contracts.actions.addPayment,
    updatePayment: Contracts.actions.updatePayment,
    deletePayment: Contracts.actions.deletePayment,
    attachBankAccount: Contracts.actions.attachBankAccount,
  },
)(Payments);

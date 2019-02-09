import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import Alert from 'react-s-alert';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import Contracts from 'contracts';
import Loading from 'components/loading';
import { SpanClick, FormGroup } from 'components/style';
import TwoColView from 'components/two_col_view';
import Balance from './balance';
import PaymentsList from './payments';

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
  const [editMode, setEditMode] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState('');

  if (loading || balanceSheet._status === null || payments._status === null || contract._status === null) return <Loading minHeight={40} />;
  if (
    (balanceSheet._status && balanceSheet._status !== 200)
    || (payments._status && payments._status !== 200)
    || (contract._status && contract._status !== 200)
  ) return <Redirect to={url} />;

  const changeBankAccount = () => new Promise((resolve, reject) => {
    attachBankAccount({
      params: { bankAccountId: selectedBankAccount, updatedAt: contract.updatedAt },
      resolve,
      reject,
      groupId,
      contractId,
    })
  }).then(() => {
    setEditMode(false);
    loadContract({ groupId, contractId });
  }).catch(e => Alert.error(JSON.stringify(e)))

  const prefix = 'admin.bankAccounts';
  const customerBankAccount = get(contract, 'customerBankAccount') || {};
  const bankAccounts = get(contract.customer, 'bankAccounts.array', []).filter(b => b.id !== customerBankAccount.id);

  return (
    <React.Fragment>
      <h5>Customer bank account:</h5>
      <SpanClick onClick={() => setEditMode(!editMode)} className="float-right" data-cy="manage tariffs CTA">
        <FormattedMessage id="admin.contracts.manageBankAccounts" /> <i className="fa fa-pencil" />
      </SpanClick>
      <br />
      {editMode && (
        <React.Fragment>
          <Row>
            <Col xs={9}>
              <FormGroup>
                <select
                  onChange={({ target: { value } }) => setSelectedBankAccount(value)}
                  className="custom-select form-control"
                  name="select-bank-account"
                >
                  <option value="">-----</option>
                  {bankAccounts.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.bankName} {b.iban} {b.bic}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </Col>
            <Col xs={3}>
              <i className="fa fa-3x fa-plus-circle cy-add-tariff" onClick={changeBankAccount} />
            </Col>
          </Row>
        </React.Fragment>
      )}
      {!Object.keys(customerBankAccount).length && 'No bank account //hacked. Plz fix.'}
      <React.Fragment>
        <TwoColView {...{ prefix, field: 'holder' }}>{customerBankAccount.holder}</TwoColView>
        <TwoColView {...{ prefix, field: 'bankName' }}>{customerBankAccount.bankName}</TwoColView>
        <TwoColView {...{ prefix, field: 'bic' }}>{customerBankAccount.bic}</TwoColView>
        <TwoColView {...{ prefix, field: 'iban' }}>{customerBankAccount.iban}</TwoColView>
        <TwoColView {...{ prefix, field: 'directDebit' }}>
          {customerBankAccount.directDebit ? <i className="fa fa-check" /> : ''}
        </TwoColView>
      </React.Fragment>
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

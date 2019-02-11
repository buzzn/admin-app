import React, { useState } from 'react';
import Alert from 'react-s-alert';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { SpanClick, FormGroup } from 'components/style';
import TwoColView from 'components/two_col_view';

const BankAccount = ({
  title,
  bankAccount,
  bankAccounts,
  attachBankAccount,
  groupId,
  contractId,
  loadContract,
  contract,
  partyType,
}) => {
  const prefix = 'admin.bankAccounts';

  const [editMode, setEditMode] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState('');

  const changeBankAccount = () => new Promise((resolve, reject) => {
    attachBankAccount({
      params: { bankAccountId: selectedBankAccount, updatedAt: contract.updatedAt },
      resolve,
      reject,
      groupId,
      contractId,
      partyType,
    });
  })
    .then(() => {
      setEditMode(false);
      loadContract({ groupId, contractId });
    })
    .catch(e => Alert.error(JSON.stringify(e)));

  return (
    <React.Fragment>
      <h5>{title}:</h5>
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
      {!Object.keys(bankAccount).length && 'No bank account //hacked. Plz fix.'}
      <React.Fragment>
        <TwoColView {...{ prefix, field: 'holder' }}>{bankAccount.holder}</TwoColView>
        <TwoColView {...{ prefix, field: 'bankName' }}>{bankAccount.bankName}</TwoColView>
        <TwoColView {...{ prefix, field: 'bic' }}>{bankAccount.bic}</TwoColView>
        <TwoColView {...{ prefix, field: 'iban' }}>{bankAccount.iban}</TwoColView>
        <TwoColView {...{ prefix, field: 'directDebit' }}>
          {bankAccount.directDebit ? <i className="fa fa-check" /> : ''}
        </TwoColView>
      </React.Fragment>
    </React.Fragment>
  );
};

export default BankAccount;

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ReactTable from 'react-table';
import Contracts from 'contracts';
import EditBankAccount from './edit_bank_account';

const BankAccounts = ({ bankAccounts, updateBankAccount, validationRules, groupId, partyId, partyType }) => {
  const prefix = 'admin.bankAccounts';

  // const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState({});

  const handleRowClick = rowNum => setExpanded({ [rowNum]: !expanded[rowNum] });

  const data = bankAccounts.map(b => ({ ...b }));
  const columns = [
    {
      Header: () => <FormattedMessage id={`${prefix}.tableHolder`} />,
      accessor: 'holder',
      className: 'cy-holder',
      sortable: false,
    },
    {
      Header: () => <FormattedMessage id={`${prefix}.tableBic`} />,
      accessor: 'bic',
      className: 'cy-bic',
      sortable: false,
    },
    {
      Header: () => <FormattedMessage id={`${prefix}.tableIban`} />,
      accessor: 'iban',
      className: 'cy-iban',
      sortable: false,
    },
    {
      Header: () => <FormattedMessage id={`${prefix}.tableBankName`} />,
      accessor: 'bankName',
      className: 'cy-bank-name',
      sortable: false,
    },
    {
      Header: () => <FormattedMessage id={`${prefix}.tableDirectDebit`} />,
      accessor: 'directDebit',
      className: 'cy-direct-debit',
      sortable: false,
      Cell: ({ value }) => (value ? <i className="fa fa-check" /> : false),
    },
    {
      expander: true,
      Expander: row => (row.original.updatable ? (
        <div>{row.isExpanded ? <i className="fa fa-pencil-square" /> : <i className="fa fa-pencil" />}</div>
      ) : (
          false
        )),
      className: 'cy-edit-bank-account',
    },
    {
      accessor: 'deleteBankAccount',
      className: 'cy-delete-bank-account',
      style: { color: 'red', cursor: 'pointer' },
      width: 20,
      Cell: ({ original }) => (original.deletable ? <i className="fa fa-remove" /> : false),
    },
  ];

  return (
    <div>
      <h5>
        <FormattedMessage id={`${prefix}.headerBankAccounts`} />
      </h5>
      <ReactTable
        {...{
          columns,
          data,
          expanded,
          getTdProps: (_state, rowInfo, column) => ({
            onClick: (_e, handleOriginal) => {
              if (column.expander && rowInfo.original.updatable) handleRowClick(rowInfo.viewIndex);
              // if (column.id === 'deleteBankAccount' && rowInfo.original.deletable && confirm('Delete?')) deletePayment({ groupId, contractId, paymentId: rowInfo.original.id });
              handleOriginal && handleOriginal();
            },
          }),
          SubComponent: ({ original, viewIndex }) => (
            <EditBankAccount
              {...{
                initialValues: original,
                updateBankAccount: ({ params, resolve, reject }) => updateBankAccount({
                  resolve,
                  reject,
                  params,
                  groupId,
                  partyId,
                  partyType,
                  bankAccountId: original.id,
                }),
                form: `editPayment-${original.id}`,
                validationRules: validationRules.paymentUpdate,
                handleCancel: () => handleRowClick(viewIndex),
              }}
            />
          ),
        }}
      />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    validationRules: state.contracts.validationRules,
  };
}

export default connect(
  mapStateToProps,
  {
    updateBankAccount: Contracts.actions.updateBankAccount,
  },
)(BankAccounts);

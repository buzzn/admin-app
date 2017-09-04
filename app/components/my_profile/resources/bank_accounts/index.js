import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import ReactTable from 'react-table';
import { tableParts } from 'react_table_config';

const BankAccounts = ({ bankAccounts, intl }) => {
  const data = bankAccounts.map(b => ({
    ...b,
    accountName: b.accountName,
    bankName: b.bankName,
    encIban: b.encryptedIban,
    status: b.status,
    link: `/my-profile/bank-accounts/${b.id}`,
  }));

  const columns = [
    {
      Header: intl.formatMessage({ id: 'admin.bankAccounts.tableAccountName' }),
      accessor: 'accountName',
      minWidth: 200,
    },
    {
      Header: intl.formatMessage({ id: 'admin.bankAccounts.tableBankName' }),
      accessor: 'bankName',
      minWidth: 200,
    },
    {
      Header: intl.formatMessage({ id: 'admin.bankAccounts.tableEncryptedIban' }),
      accessor: 'encIban',
      minWidth: 200,
    },
    {
      Header: intl.formatMessage({ id: 'admin.bankAccounts.tableStatus' }),
      accessor: 'status',
      minWidth: 200,
    },
    {
      Header: '',
      accessor: 'link',
      sortable: false,
      filterable: false,
      resizable: false,
      width: 100,
      Cell: tableParts.components.linkCell,
    },
  ];

  return (
    <div className="row">
      <div className="col-12">
        <h5><FormattedMessage id="admin.persons.headerBankAccounts"/></h5>
        <FormattedMessage id="admin.persons.descriptionBankAccounts"/>
      </div>
      <div className="col-12 no-padding">
        <ReactTable {...{ data, columns }} />
      </div>
    </div>
  );
};

BankAccounts.propTypes = {
  bankAccounts: PropTypes.array.isRequired,
};

export default injectIntl(BankAccounts);

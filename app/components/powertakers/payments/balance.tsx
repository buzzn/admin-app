import React, { useState } from 'react';
import Alert from 'react-s-alert';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'reactstrap';
import { tableParts as TableParts } from 'react_table_config';
import ReactTableSorted from 'components/react_table_sorted';
import { FormGroup } from 'components/style';
import { BalanceWrapper } from './style';

const Balance = ({ balanceSheet, updateContract, intl, groupId, contractId }) => {
  const prefix = 'admin.contracts';
  const [input, setInput] = useState({ amount: '', comment: '' });
  const [active, setActive] = useState({ amount: false, comment: false });
  const submit = () => new Promise((resolve, reject) => {
    updateContract({
      resolve,
      reject,
      params: { ...input, amount: parseFloat(input.amount) * 1000 },
    });
  })
    .then(() => Alert.success('Saved'))
    .catch(err => Alert.error(JSON.stringify(err)));
  const data = balanceSheet.entries.array.map(e => ({
    ...e,
    createdAt: new Date(e.createdAt),
  }));
  const columns = [
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableAccountAmount` })} />
      ),
      accessor: 'amount',
      className: 'cy-account-amount',
      Cell: ({ value }) => <span>{(value / 1000).toFixed(2)} €</span>,
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableAccountComment` })} />
      ),
      accessor: 'comment',
      className: 'cy-account-comment',
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableAccountCreatedAt` })} />
      ),
      accessor: 'createdAt',
      className: 'cy-account-createdat',
      Cell: ({ value }) => moment(value).format('DD.MM.YYYY HH:mm:ss'),
    },
  ];

  return (
    <BalanceWrapper>
      <h5 className="grey-underline mt-5 pb-2" data-cy="total balance">
        Total balance: {(balanceSheet.total / 1000).toFixed(2)} €
      </h5>
      <Row>
        <Col xs={5}>
          {' '}
          <FormGroup className="form-group">
            <input
              id="account-amount"
              data-cy="account amount"
              className="form-control"
              onChange={({ target: { value } }) => setInput({ ...input, amount: value })}
              value={input.amount}
              onFocus={() => setActive({ ...active, amount: true })}
              onBlur={() => setActive({ ...active, amount: false })}
            />
            <label className={`${!!input.amount || active.amount ? 'top' : 'center'}`} htmlFor="account-amount">
              Amount €
            </label>
          </FormGroup>
        </Col>
        <Col xs={5}>
          {' '}
          <FormGroup className="form-group">
            <input
              id="account-comment"
              data-cy="account comment"
              className="form-control"
              onChange={({ target: { value } }) => setInput({ ...input, comment: value })}
              value={input.comment}
              onFocus={() => setActive({ ...active, comment: true })}
              onBlur={() => setActive({ ...active, comment: false })}
            />
            <label className={`${!!input.comment || active.comment ? 'top' : 'center'}`} htmlFor="account-comment">
              Comment
            </label>
          </FormGroup>
        </Col>
        <Col xs={2}>
          <button className="btn btn-primary" data-cy="button add" onClick={submit}>
            <i className="fa fa-plus" />
          </button>
        </Col>
      </Row>
      <ReactTableSorted
        {...{
          data,
          columns,
          uiSortPath: `groups.${groupId}.contracts.${contractId}.billings`,
          defaultPageSize: 5,
          showPagination: true,
        }}
      />
    </BalanceWrapper>
  );
};

export default injectIntl(Balance);

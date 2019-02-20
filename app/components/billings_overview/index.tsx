import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';
import moment from 'moment';
import Contracts from 'contracts';
import ReactTableSorted from 'components/react_table_sorted';
import Loading from 'components/loading';
import { tableParts as TableParts } from 'react_table_config';
import BillingDetails from 'components/billing_details';
import { CellWrap } from './style';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');
const DefaultThirdParty = require('images/default_3rd_party.jpg');

const BillingsOverview = ({
  loadGroupPowertakers,
  setGroupPowertakers,
  loading,
  powertakers,
  history,
  match: { params: { groupId } },
  intl,
}) => {
  const [expanded, setExpanded] = useState({});
  useEffect(() => {
    loadGroupPowertakers({ groupId, withBillings: true });
    return () => setGroupPowertakers({ _status: null, array: [] });
  }, [groupId]);

  if (powertakers._status === 404 || powertakers._status === 403) {
    setGroupPowertakers({ _status: null, array: [] });
    return <Redirect to="/groups" />;
  }

  if (powertakers._status === null || loading) return <Loading minHeight={40} />;

  const prefix = 'admin.billings';
  const data = sortBy(powertakers.array, ['id'])
    .filter(p => !!p.billings && p.billings.array.length)
    .flatMap(p => p.billings.array.map(b => ({
      ...b,
      name:
          p.type === 'contract_localpool_third_party'
            ? { value: 'drittbeliefert', image: DefaultThirdParty, type: 'avatar' }
            : p.customer.type === 'person'
              ? {
                value: `${p.customer.lastName} ${p.customer.firstName}`,
                image: p.customer.image || DefaultPerson,
                type: 'avatar',
                clickable: true,
              }
              : {
                value: p.customer.name,
                image: p.customer.image || DefaultOrganisation,
                type: 'avatar',
                clickable: true,
              },
      email: get(p.customer, 'contact.email') || p.customer.email,
      beginDate: { display: moment(b.beginDate).format('DD.MM.YYYY'), value: b.beginDate },
      lastDate: { display: moment(b.lastDate).format('DD.MM.YYYY'), value: b.lastDate },
      contract: { ...p, billings: null },
    })));
  const columns = [
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.contracts.tableName' })} />
      ),
      accessor: 'name',
      className: 'cy-powertaker',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: ({ value, original }) => (
        <CellWrap status={original.status}>
          <TableParts.components.iconNameCell {...{ value }} />
        </CellWrap>
      ),
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableInvoiceNumber` })} />
      ),
      accessor: 'fullInvoiceNumber',
      className: 'cy-invoice-number',
      Cell: ({ value, original }) => <CellWrap status={original.status}>{value}</CellWrap>,
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBeginDate` })} />,
      accessor: 'beginDate',
      className: 'cy-begin-date',
      filterable: false,
      sortMethod: TableParts.sort.sortByDateTime,
      Cell: ({ value: { display }, original }) => <CellWrap status={original.status}>{display}</CellWrap>,
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableEndDate` })} />,
      accessor: 'lastDate',
      filterable: false,
      sortMethod: TableParts.sort.sortByDateTime,
      Cell: ({ value: { display }, original }) => <CellWrap status={original.status}>{display}</CellWrap>,
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableStatus` })} />,
      accessor: 'status',
      sortMethod: TableParts.sort.sortByBillingstatus,
      Cell: ({ value, original }) => (
        <CellWrap status={original.status}>
          {value}{' '}
          {!original.email && <i className="fa fa-fax" />}
        </CellWrap>
      ),
    },
    {
      expander: true,
      Expander: row => (
        <CellWrap status={row.original.status}>
          {row.isExpanded ? <i className="fa fa-chevron-up" /> : <i className="fa fa-chevron-down" />}
        </CellWrap>
      ),
      style: { color: '#bdbdbd' },
    },
  ];

  return (
    <React.Fragment>
      <ReactTableSorted
        {...{
          data,
          columns,
          expanded,
          filterable: true,
          uiSortPath: `groups.${groupId}.billings`,
          getTrProps: (_state, rowInfo) => ({
            onClick: (_event, handleOriginal) => {
              setExpanded({ [rowInfo.viewIndex]: !expanded[rowInfo.viewIndex] });
              handleOriginal && handleOriginal();
            },
          }),
          SubComponent: row => (
            <BillingDetails
              {...{
                history,
                groupId,
                contractId: row.original.contract.id,
                billingId: row.original.id,
              }}
            />
          ),
        }}
      />
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    powertakers: state.contracts.groupPowertakers,
    loading: state.contracts.loadingGroupPowertakers,
  };
}

export default connect(
  mapStateToProps,
  {
    loadGroupPowertakers: Contracts.actions.loadGroupPowertakers,
    setGroupPowertakers: Contracts.actions.setGroupPowertakers,
  },
)(injectIntl(BillingsOverview));

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import Alert from 'react-s-alert';
import moment from 'moment';
import Contracts from 'contracts';
import Billings from 'billings';
import ReactTableSorted from 'components/react_table_sorted';
import Loading from 'components/loading';
import { tableParts as TableParts } from 'react_table_config';
import BillingDetails from 'components/billing_details';
import { CellWrap } from './style';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');
const DefaultThirdParty = require('images/default_3rd_party.jpg');

interface ManageReadingInterface {
  attachReading: Function;
  groupId: string;
  contractId: string;
  billingId: string;
}

export const ManageReadingContext = React.createContext<ManageReadingInterface>({
  attachReading: () => false,
  groupId: '',
  contractId: '',
  billingId: '',
});

const BillingsOverview = ({
  loadGroupPowertakers,
  setGroupPowertakers,
  loading,
  powertakers,
  attachReading,
  history,
  match: { params: { groupId } },
  intl,
  validationRules,
  updateBilling,
}) => {
  const [expanded, setExpanded] = useState({});
  useEffect(
    () => {
      loadGroupPowertakers({ groupId, withBillings: true });
      return () => setGroupPowertakers({ _status: null, array: [] });
    },
    [groupId],
  );

  if (powertakers._status === 404 || powertakers._status === 403) {
    setGroupPowertakers({ _status: null, array: [] });
    return <Redirect to="/groups" />;
  }

  if (powertakers._status === null || loading) return <Loading minHeight={40} />;

  const prefix = 'admin.billings';
  const data = powertakers.array
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
      accessor: 'invoiceNumber',
      className: 'cy-invoice-number',
      Cell: ({ value, original }) => <CellWrap status={original.status}>{value}</CellWrap>,
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBeginDate` })} />,
      accessor: 'beginDate',
      className: 'cy-begin-date',
      sortMethod: TableParts.sort.sortByDateTime,
      Cell: ({ value: { display }, original }) => <CellWrap status={original.status}>{display}</CellWrap>,
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableEndDate` })} />,
      accessor: 'lastDate',
      sortMethod: TableParts.sort.sortByDateTime,
      Cell: ({ value: { display }, original }) => <CellWrap status={original.status}>{display}</CellWrap>,
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableStatus` })} />,
      accessor: 'status',
      sortMethod: TableParts.sort.sortByBillingstatus,
      Cell: ({ value, original }) => <CellWrap status={original.status}>{value}</CellWrap>,
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
  const submitUpdateBilling = ({ billingId, contractId, params }) => new Promise((resolve, reject) => {
    updateBilling({ resolve, reject, params, groupId, contractId, billingId });
  })
    .then(res => res)
    .catch(err => Alert.error(err.errors.status ? err.errors.status.errorMessage : err.errors.completeness.join(', ')));

  return (
    <React.Fragment>
      <ReactTableSorted
        {...{
          data,
          columns,
          expanded,
          uiSortPath: `groups.${groupId}.billings`,
          getTrProps: (_state, rowInfo) => ({
            onClick: (_event, handleOriginal) => {
              setExpanded({ ...expanded, [rowInfo.viewIndex]: !expanded[rowInfo.viewIndex] });
              handleOriginal && handleOriginal();
            },
          }),
          SubComponent: row => (
            <ManageReadingContext.Provider
              value={{
                attachReading,
                groupId,
                contractId: row.original.contract.id,
                billingId: row.original.id,
              }}
            >
              <BillingDetails
                {...{
                  ManageReadingContext,
                  billing: row.original,
                  history,
                  marketLocation: row.original.contract.registerMeta,
                  groupId,
                  initialValues: row.original,
                  validationRules: validationRules.billingUpdate,
                  form: `billingUpdateForm${row.original.id}`,
                  onSubmit: params => submitUpdateBilling({
                    billingId: row.original.id,
                    contractId: row.original.contract.id,
                    params: {
                      status: params.status,
                      invoiceNumber: params.invoiceNumber,
                      updatedAt: params.updatedAt,
                    },
                  }),
                }}
              />
            </ManageReadingContext.Provider>
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
    validationRules: state.billings.validationRules,
  };
}

export default connect(
  mapStateToProps,
  {
    loadGroupPowertakers: Contracts.actions.loadGroupPowertakers,
    setGroupPowertakers: Contracts.actions.setGroupPowertakers,
    attachReading: Billings.actions.attachReading,
    updateBilling: Billings.actions.updateBilling,
  },
)(injectIntl(BillingsOverview));

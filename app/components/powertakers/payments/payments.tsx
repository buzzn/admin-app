import React, { useState } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';
import ReactTableSorted from 'components/react_table_sorted';
import { SpanClick } from 'components/style';
import AddPayment from './add_payment';
import EditPayment from './edit_payment';
import { PaymentsWrapper } from './style';

const PaymentsList = ({
  payments,
  tariffs,
  addPayment,
  updatePayment,
  deletePayment,
  intl,
  groupId,
  contractId,
  validationRules,
}) => {
  const prefix = 'admin.payments';
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState({});

  const handleRowClick = rowNum => setExpanded({ [rowNum]: !expanded[rowNum] });
  const handleAddPayment = ({ params, resolve, reject }) => addPayment({ resolve, reject, params, groupId, contractId });

  const data = payments.map(p => ({ ...p }));

  const columns = [
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBeginDate` })} />,
      accessor: 'beginDate',
      className: 'cy-begin-date',
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableEnergyConsumptionKwhPa` })} />
      ),
      accessor: 'energyConsumptionKwhPa',
      className: 'cy-energy-consumption-kwh-pa',
    },
    {
      Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableCycle` })} />,
      accessor: 'cycle',
      className: 'cy-cycle',
    },
    {
      Header: () => (
        <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tablePriceCents` })} />
      ),
      accessor: 'priceCents',
      className: 'cy-price-cents',
    },
    {
      expander: true,
      Expander: row => (row.original.updatable ? (
          <div>{row.isExpanded ? <i className="fa fa-pencil-square" /> : <i className="fa fa-pencil" />}</div>
      ) : (
        false
      )),
      className: 'cy-edit-payment',
    },
    {
      accessor: 'deletePayment',
      className: 'cy-price-cents',
      style: { color: 'red', cursor: 'pointer' },
      width: 20,
      Cell: ({ original }) => (original.deletable ? <i className="fa fa-remove" /> : false),
    },
  ];

  return (
    <PaymentsWrapper>
      <h5 className="grey-underline mt-5 pb-2">
        Payments:
        <SpanClick onClick={() => setIsOpen(true)} className="float-right" data-cy="add payment CTA">
          <FormattedMessage id={`${prefix}.addNew`} /> <i className="fa fa-plus-circle" />
        </SpanClick>
      </h5>
      <ReactTableSorted
        {...{
          data,
          columns,
          expanded,
          getTdProps: (_state, rowInfo, column) => ({
            onClick: (_e, handleOriginal) => {
              if (column.expander && rowInfo.original.updatable) handleRowClick(rowInfo.viewIndex);
              if (column.id === 'deletePayment' && rowInfo.original.deletable && confirm('Delete?')) deletePayment({ groupId, contractId, paymentId: rowInfo.original.id });
              handleOriginal && handleOriginal();
            },
          }),
          uiSortPath: `groups.${groupId}.contracts.${contractId}.payments`,
          defaultPageSize: 5,
          showPagination: true,
          SubComponent: ({ original, viewIndex }) => (
            <EditPayment
              {...{
                initialValues: original,
                updatePayment: ({ params, resolve, reject }) => updatePayment({ resolve, reject, params, groupId, contractId, paymentId: original.id }),
                form: `editPayment-${original.id}`,
                validationRules: validationRules.paymentUpdate,
                handleCancel: () => handleRowClick(viewIndex),
              }}
            />
          ),
        }}
      />
      <AddPayment
        {...{
          isOpen,
          toggle: () => setIsOpen(!isOpen),
          tariffs,
          validationRules: validationRules.payment,
          form: 'addPayment',
          addPayment: handleAddPayment,
        }}
      />
    </PaymentsWrapper>
  );
};

export default injectIntl(PaymentsList);

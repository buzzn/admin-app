import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';
import Alert from 'react-s-alert';
import Billings from 'billings';
import Contracts from 'contracts';
import { tableParts as TableParts } from 'react_table_config';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';
import TwoColField from 'components/two_col_field';
import TwoColView from 'components/two_col_view';
import AddReading from 'components/add_reading';
import Loading from 'components/loading';
import { BillingDetailsWrapper, DoubleCell, ButtonsWrapper, ReadingAction, ErrCell, DocumentsWrapper } from './style';

const BillingDetails = ({
  attachReading,
  loadContract,
  updateBilling,
  contractId,
  billingId,
  intContract,
  intBilling,
  extContract = null,
  extBilling = null,
  loading,
  getBillingPDFData,
  close,
  intl,
  history,
  groupId,
  dirty,
  validationRules,
  handleSubmit,
  reset,
  submitting,
}) => {
  useEffect(() => {
    if (!extContract && !extBilling) loadContract({ groupId, contractId });
  }, [billingId]);
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState({});
  const [item, setItem] = useState({});
  const [minHeight, setMinHeight] = useState(340);
  useEffect(() => {
    const node = ReactDOM.findDOMNode(this) as HTMLElement;
    setMinHeight(node ? node.clientHeight : 290);
  }, [billingId]);

  const contract = extContract || intContract;
  const billing = extBilling || intBilling;

  if (loading || !contract._status) {
    if (minHeight) return <Loading {...{ minHeight, unit: 'px' }} />;
    return <Loading minHeight={40} />;
  }
  if (contract._status !== 200) return <h5>{contract._status}</h5>;
  if (!billing) return <h5>No billing :(</h5>;

  const { customer, registerMeta } = contract;
  const prefix = 'admin.billings';
  const centered = 'true';

  const switchEditMode = (event) => {
    if (dirty && editMode && confirm(intl.formatMessage({ id: 'admin.messages.cancelDirtyForm' }))) {
      reset();
      setEditMode(false);
    } else if (!dirty) {
      setEditMode(!editMode);
    } else {
      event.currentTarget.blur();
      event.preventDefault();
    }
  };

  const submit = params => new Promise((resolve, reject) => {
    updateBilling({
      resolve,
      reject,
      params: { status: params.status, invoiceNumber: params.invoiceNumber, updatedAt: params.updatedAt },
      groupId,
      contractId,
      billingId,
    });
  })
    .then(res => res)
    .catch(err => Alert.error(err.errors.status ? err.errors.status.errorMessage : err.errors.completeness.join(', ')));

  const allowedStatus = Object.keys(billing.allowedActions.update.status)
    .filter(k => billing.allowedActions.update.status[k] === true)
    .map(k => ({ value: k, label: k }));
  const reduceErrs = errObj => Object.keys(errObj).reduce((err, k) => {
    if (typeof errObj[k] === 'string') return `${err}${k}: ${errObj[k]}, `;
    if (Array.isArray(errObj[k])) return `${err}${k}: ${errObj[k].join(', ')}, `;
    return `${k}: ${reduceErrs(errObj[k])}`;
  }, '');
  const statusErrs = Object.values(billing.allowedActions.update.status)
    .filter(v => v !== true)
    .map(v => reduceErrs(v))
    .join('; ');

  const checkReading = (date, begin, item) => {
    const reading = get(item, 'register.readings.array', []).find(r => r.date === date);
    if (reading) {
      return (
        <ReadingAction
          onClick={() => handleAttachReading(
            { [begin ? 'beginReadingId' : 'endReadingId']: reading.id, updatedAt: item.updatedAt },
            item.id,
          )
          }
        >
          Attach reading
        </ReadingAction>
      );
    }
    return (
      <ReadingAction
        onClick={() => {
          setItem(item);
          setDate({ begin, date });
          setIsOpen(true);
        }}
      >
        Add reading
      </ReadingAction>
    );
  };
  const handleAttachReading = (params, billingItemId) => new Promise((resolve, reject) => {
    attachReading({
      params,
      resolve,
      reject,
      groupId,
      contractId,
      billingId,
      billingItemId,
    });
  })
    .then(() => Alert.success('Attached'))
    .catch(err => Alert.error(JSON.stringify(err)));

  const data = orderBy(billing.items.array, i => moment(i.beginDate).toDate(), 'desc').map(i => ({
    ...i,
    meterSerial: i.meter ? i.meter.productSerialnumber : '',
    linkMeter: i.meter ? `/groups/${groupId}/market-locations/meters/${i.meter.id}` : '',
    dates: {
      display: `${moment(i.beginDate).format('DD.MM.YYYY')} - ${moment(i.endDate).format('DD.MM.YYYY')}`,
      value: moment(i.beginDate).toDate(),
    },
    registerObis: i.register ? i.register.obis : '',
    linkRegister: i.register ? `/groups/${groupId}/market-locations/registers/${i.register.id}` : '',
    beginReadingKwh: i.beginReadingKwh === null ? null : intl.formatNumber(i.beginReadingKwh),
    endReadingKwh: i.endReadingKwh === null ? null : intl.formatNumber(i.endReadingKwh),
    consumedEnergyKwh: intl.formatNumber(i.consumedEnergyKwh),
    amount: {
      days: i.lengthInDays,
      kWh: intl.formatNumber(i.consumedEnergyKwh),
    },
    price: {
      days: intl.formatNumber(((i.tariff.basepriceCentsPerMonth * 12) / 100).toFixed(0)),
      kWh: intl.formatNumber(i.tariff.energypriceCentsPerKwh.toFixed(2), { minimumFractionDigits: 2 }),
    },
    netAmount: {
      days: intl.formatNumber((i.basePriceCents / 100).toFixed(2), { minimumFractionDigits: 2 }),
      kWh: intl.formatNumber((i.energyPriceCents / 100).toFixed(2), { minimumFractionDigits: 2 }),
    },
  }));

  const referenceColumns = [
    {
      Header: intl.formatMessage({ id: `${prefix}.tableMeterSerial` }),
      accessor: 'meterSerial',
      className: 'cy-hw-meter-serial',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: intl.formatMessage({ id: `${prefix}.tableRegisterObis` }),
      accessor: 'registerObis',
      style: {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    {
      Header: intl.formatMessage({ id: `${prefix}.tableDates` }),
      accessor: 'dates',
      className: 'cy-hw-dates',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: ({ value: { display } }) => display,
    },
    {
      Header: intl.formatMessage({ id: `${prefix}.tableBeginReadingKwh` }),
      accessor: 'beginReadingKwh',
      className: 'cy-hw-begin-reading',
      Cell: ({ value, original }) => (value || value === 0 ? `${value} kWh` : <ErrCell>{checkReading(original.beginDate, true, original)}</ErrCell>),
    },
    {
      Header: intl.formatMessage({ id: `${prefix}.tableEndReadingKwh` }),
      accessor: 'endReadingKwh',
      className: 'cy-hw-end-reading',
      Cell: ({ value, original }) => (value || value === 0 ? `${value} kWh` : <ErrCell>{checkReading(original.lastDate, false, original)}</ErrCell>),
    },
    {
      Header: intl.formatMessage({ id: `${prefix}.tableConsumedEnergyKwh` }),
      accessor: 'consumedEnergyKwh',
      className: 'cy-hw-consumed',
      Cell: ({ value }) => `${value} kWh`,
    },
  ];

  const hasErr = item => !!Object.keys(item.incompleteness).length;
  const invoiceColumns = [
    {
      Header: intl.formatMessage({ id: `${prefix}.tableDesignation` }),
      accessor: '',
      Cell: ({ original }) => (
        <DoubleCell hasErr={hasErr(original)}>
          <div>
            <FormattedMessage id={`${prefix}.basePrice`} />
          </div>
          <div>
            <FormattedMessage id={`${prefix}.workingPrice`} />
          </div>
        </DoubleCell>
      ),
    },
    {
      Header: intl.formatMessage({ id: `${prefix}.tableDates` }),
      accessor: 'dates',
      filterMethod: TableParts.filters.filterByValue,
      sortMethod: TableParts.sort.sortByValue,
      Cell: ({ value: { display }, original }) => (
        <DoubleCell hasErr={hasErr(original)}>
          <div>{display}</div>
          <div>{display}</div>
        </DoubleCell>
      ),
    },
    {
      Header: intl.formatMessage({ id: 'admin.tariffs.name' }),
      accessor: 'tariff.name',
      className: 'cy-item-tariff',
      Cell: ({ value, original }) => (
        <DoubleCell hasErr={hasErr(original)}>
          <div>{value}</div>
          <div>{value}</div>
        </DoubleCell>
      ),
    },
    {
      Header: intl.formatMessage({ id: `${prefix}.tableAmount` }),
      accessor: 'amount',
      width: 80,
      Cell: ({ value: { days, kWh }, original }) => (
        <DoubleCell hasErr={hasErr(original)}>
          <div>{days}</div>
          <div>{kWh}</div>
        </DoubleCell>
      ),
    },
    {
      Header: intl.formatMessage({ id: `${prefix}.tableUnit` }),
      accessor: '',
      width: 50,
      Cell: ({ original }) => (
        <DoubleCell hasErr={hasErr(original)}>
          <div>Tage</div>
          <div>kWh</div>
        </DoubleCell>
      ),
    },
    {
      Header: intl.formatMessage({ id: `${prefix}.tablePriceForUnit` }),
      accessor: 'price',
      Cell: ({ value: { days, kWh }, original }) => (
        <DoubleCell hasErr={hasErr(original)}>
          <div>{days} €/Jahr</div>
          <div>{kWh} ¢/kWh</div>
        </DoubleCell>
      ),
    },
    {
      Header: intl.formatMessage({ id: `${prefix}.tableNetAmount` }),
      accessor: 'netAmount',
      Cell: ({ value: { days, kWh }, original }) => (
        <DoubleCell hasErr={hasErr(original)}>
          <div>{days} €</div>
          <div>{kWh} €</div>
        </DoubleCell>
      ),
    },
  ];

  return (
    <BillingDetailsWrapper>
      <div className="wrapper">
        {!!close && <i className="buzzn-close close" onClick={close} />}
        <div className="title top h5">
          <FormattedMessage id={`${prefix}.titleDetails`} />
        </div>
        <Row className="pl-3 pr-3">
          <Col xs={6}>
            <TwoColView {...{ prefix, field: 'customerName', centered }}>
              <Link to={`/groups/${groupId}/powertakers/${contract.id}/powertaker`}>
                {customer.name || `${customer.firstName} ${customer.lastName}`}
              </Link>
            </TwoColView>
            <TwoColView {...{ prefix: 'admin.marketLocations', field: 'name', centered }}>
              <Link to={`/groups/${groupId}/market-locations/${registerMeta.id}`}>{registerMeta.name}</Link>
            </TwoColView>
            <TwoColView {...{ prefix, field: 'dateRange', centered }}>
              {moment(billing.beginDate).format('DD.MM.YYYY')} - {moment(billing.endDate).format('DD.MM.YYYY')}
            </TwoColView>
          </Col>
          <Col xs={6}>
            <TwoColView {...{ prefix, field: 'customerEmail', centered }}>
              <a href={`mailto:${customer.email}`}>{customer.email}</a>
            </TwoColView>
            <TwoColView {...{ prefix: 'admin.contracts', field: 'fullContractNumber', centered }}>
              <Link to={`/groups/${groupId}/powertakers/${contract.id}`}>{contract.fullContractNumber}</Link>
            </TwoColView>
            <form onSubmit={handleSubmit(submit)}>
              <div className="edit-switch-wrap">
                {!editMode && (
                  <i
                    className="edit-switch buzzn-pencil float-right"
                    data-cy="billing edit switch"
                    onClick={switchEditMode}
                  />
                )}
              </div>
              <TwoColField
                {...{
                  prefix,
                  name: 'invoiceNumber',
                  editMode: editMode ? !submitting : false,
                  validationRules,
                  component: EditableInput,
                  centered: true,
                  noColon: true,
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'status',
                  editMode: editMode ? !submitting : false,
                  validationRules,
                  component: EditableSelect,
                  centered: true,
                  noColon: true,
                  listOverride: allowedStatus,
                  noValTranslations: true,
                }}
              />
              {editMode
                && (submitting ? (
                  <Loading {...{ minHeight: 4 }} />
                ) : (
                  <ButtonsWrapper>
                    <div className="float-right mt-3">
                      <button className="btn btn-link" onClick={switchEditMode}>
                        <FormattedMessage id="admin.buttons.cancel" /> <i className="fa fa-times" />
                      </button>
                      <button className="btn btn-primary" type="submit">
                        <FormattedMessage id="admin.buttons.submit" />
                      </button>
                    </div>
                    {!!statusErrs && <span style={{ color: 'red' }}>STATUS ERRORS: {statusErrs}</span>}
                  </ButtonsWrapper>
                ))}
            </form>
          </Col>
        </Row>
        {!!billing.documents.array.length && (
          <DocumentsWrapper>
            <h5>Invoices:</h5>
            {billing.documents.array.map(d => (
              <Row key={d.id}>
                <Col xs={8}>
                  <span
                    className="invoice-file"
                    onClick={() => getBillingPDFData({
                      groupId,
                      contractId: contract.id,
                      billingId: billing.id,
                      documentId: d.id,
                      fileName: d.filename,
                    })
                    }
                  >
                    {d.filename}
                  </span>
                </Col>
                <Col xs={4}>
                  <span className="invoice-date">{moment(d.createdAt).format('DD.MM.YYYY')}</span>
                </Col>
              </Row>
            ))}
          </DocumentsWrapper>
        )}
        <div className="title h5">
          <FormattedMessage id={`${prefix}.titleReference`} />
        </div>
        <ReactTable
          {...{
            data,
            columns: referenceColumns,
            getTdProps: (_state, rowInfo, column) => ({
              onClick: (_e, handleOriginal) => {
                if (column.id === 'meterSerial' && rowInfo.original.linkMeter) {
                  history.push(rowInfo.original.linkMeter);
                }
                if (column.id === 'registerObis' && rowInfo.original.linkRegister) {
                  history.push(rowInfo.original.linkRegister);
                }
                if (handleOriginal) handleOriginal();
              },
            }),
            sortable: false,
            resizable: false,
          }}
        />
        <div className="title h5">
          <FormattedMessage id={`${prefix}.titleInvoices`} />
        </div>
        <ReactTable
          {...{
            data,
            columns: invoiceColumns,
            sortable: false,
            resizable: false,
          }}
        />
      </div>
      {isOpen && (
        <AddReading
          {...{
            // @ts-ignore
            edifactMeasurementMethod: item.meter.edifactMeasurementMethod,
            isOpen,
            switchAddReading: () => setIsOpen(!isOpen),
            groupId,
            // @ts-ignore
            meterId: item.meter.id,
            // @ts-ignore
            registerId: item.register.id,
            // @ts-ignore
            date: date.date,
            cb: () => setIsOpen(false),
            billingItem: {
              // @ts-ignore
              begin: date.begin,
              contractId,
              billingId,
              // @ts-ignore
              billingItemId: item.id,
              // @ts-ignore
              updatedAt: item.updatedAt,
            },
          }}
        />
      )}
    </BillingDetailsWrapper>
  );
};

const WithForm = reduxForm({ enableReinitialize: true })(injectIntl(BillingDetails));

function mapStateToProps(state, { billingId, extBilling = null }) {
  const intContract = state.contracts.contract;
  const intBilling = get(intContract, 'billings.array', []).find(b => b.id === billingId);
  return {
    form: `billingUpdateForm${billingId}`,
    intBilling,
    intContract,
    loading: state.contracts.loadingContract,
    initialValues: extBilling || intBilling,
    validationRules: state.billings.validationRules.billingUpdate,
  };
}

export default connect(
  mapStateToProps,
  {
    attachReading: Billings.actions.attachReading,
    loadContract: Contracts.actions.loadContract,
    getBillingPDFData: Billings.actions.getBillingPDFData,
    updateBilling: Billings.actions.updateBilling,
  },
)(WithForm);

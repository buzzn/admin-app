import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import { Row, Col } from 'reactstrap';
import BillingCycles from 'billing_cycles';
import Loading from 'components/loading';
import TwoColView from 'components/two_col_view';
import ReactTable from 'react-table';
import { tableParts as TableParts } from 'react_table_config';
import { BillingDetails, DoubleCell } from './style';

class Details extends React.Component<ExtProps & StateProps & DispatchProps & InjectedIntlProps, DetailsState> {
  state = { minHeight: 340 };

  componentDidMount() {
    const { loadBilling, billingId, groupId, billingCycleId } = this.props;
    loadBilling({ billingId, groupId, billingCycleId });
  }

  componentDidUpdate(prev) {
    const { loadBilling, billingId, groupId, billingCycleId, billing, close, setBilling } = this.props;

    if (billingId && billing._status && billing._status !== 200) {
      setBilling({ _status: null });
      close();
    }

    if (billingId && billingId !== prev.billingId) {
      const node = ReactDOM.findDOMNode(this);
      this.setState({ minHeight: node ? node.clientHeight : 290 });
      loadBilling({ billingId, groupId, billingCycleId });
    }
  }

  render() {
    const { close, loading, billing, marketLocation, billingId, url, intl, history } = this.props;
    const { minHeight } = this.state;

    if (!billingId) return null;

    if (loading || billing._status === null) return <Loading {...{ minHeight, unit: 'px' }} />;
    if (billing._status && billing._status !== 200) return null;

    const { contract } = billing;
    const { customer } = contract;
    const prefix = 'admin.billings';
    const centered = 'true';

    const data = orderBy(billing.items.array, i => moment(i.beginDate).toDate(), 'desc').map(i => ({
      ...i,
      meterSerial: i.meter ? i.meter.productSerialnumber : '',
      linkMeter: i.meter
        ? `${url
          .split('/')
          .slice(0, -1)
          .join('/')}/system/meters/${i.meter.id}`
        : '',
      dates: {
        display: `${moment(i.beginDate).format('DD.MM.YYYY')} - ${moment(i.endDate).format('DD.MM.YYYY')}`,
        value: moment(i.beginDate).toDate(),
      },
      beginReadingKwh: intl.formatNumber(i.beginReadingKwh),
      endReadingKwh: intl.formatNumber(i.endReadingKwh),
      consumedEnergyKwh: intl.formatNumber(i.consumedEnergyKwh),
      amount: {
        days: i.lengthInDays,
        kWh: intl.formatNumber(i.consumedEnergyKwh),
      },
      price: {
        days: intl.formatNumber((i.tariff.basepriceCentsPerMonth * 12 / 100).toFixed(0)),
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
        style: {
          cursor: 'pointer',
          textDecoration: 'underline',
        },
      },
      {
        Header: intl.formatMessage({ id: `${prefix}.tableDates` }),
        accessor: 'dates',
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
        Cell: ({ value: { display } }) => display,
      },
      {
        Header: intl.formatMessage({ id: `${prefix}.tableBeginReadingKwh` }),
        accessor: 'beginReadingKwh',
        Cell: ({ value }) => `${value} kWh`,
      },
      {
        Header: intl.formatMessage({ id: `${prefix}.tableEndReadingKwh` }),
        accessor: 'endReadingKwh',
        Cell: ({ value }) => `${value} kWh`,
      },
      {
        Header: intl.formatMessage({ id: `${prefix}.tableConsumedEnergyKwh` }),
        accessor: 'consumedEnergyKwh',
        Cell: ({ value }) => `${value} kWh`,
      },
    ];

    const invoiceColumns = [
      {
        Header: intl.formatMessage({ id: `${prefix}.tableDesignation` }),
        accessor: '',
        Cell: () => (
          <DoubleCell>
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
        Cell: ({ value: { display } }) => (
          <DoubleCell>
            <div>{display}</div>
            <div>{display}</div>
          </DoubleCell>
        ),
      },
      {
        Header: intl.formatMessage({ id: 'admin.tariffs.name' }),
        accessor: 'tariff.name',
        Cell: ({ value }) => (
          <DoubleCell>
            <div>{value}</div>
            <div>{value}</div>
          </DoubleCell>
        ),
      },
      {
        Header: intl.formatMessage({ id: `${prefix}.tableAmount` }),
        accessor: 'amount',
        width: 80,
        Cell: ({ value: { days, kWh } }) => (
          <DoubleCell>
            <div>{days}</div>
            <div>{kWh}</div>
          </DoubleCell>
        ),
      },
      {
        Header: intl.formatMessage({ id: `${prefix}.tableUnit` }),
        accessor: '',
        width: 50,
        Cell: () => (
          <DoubleCell>
            <div>Tage</div>
            <div>kWh</div>
          </DoubleCell>
        ),
      },
      {
        Header: intl.formatMessage({ id: `${prefix}.tablePriceForUnit` }),
        accessor: 'price',
        Cell: ({ value: { days, kWh } }) => (
          <DoubleCell>
            <div>{days} €/Jahr</div>
            <div>{kWh} ¢/kWh</div>
          </DoubleCell>
        ),
      },
      {
        Header: intl.formatMessage({ id: `${prefix}.tableNetAmount` }),
        accessor: 'netAmount',
        Cell: ({ value: { days, kWh } }) => (
          <DoubleCell>
            <div>{days} €</div>
            <div>{kWh} €</div>
          </DoubleCell>
        ),
      },
    ];

    return (
      <BillingDetails>
        <div className="wrapper">
          <i className="buzzn-close close" onClick={close} />
          <div className="title top h5">
            <FormattedMessage id={`${prefix}.titleDetails`} />
          </div>
          <Row className="pl-3 pr-3">
            <Col xs={6}>
              <TwoColView {...{ prefix, field: 'customerName', centered }}>
                <Link
                  to={`${url
                    .split('/')
                    .slice(0, -1)
                    .join('/')}/powertakers/${contract.id}/powertaker`}
                >
                  {customer.name || `${customer.firstName} ${customer.lastName}`}
                </Link>
              </TwoColView>
              <TwoColView {...{ prefix: 'admin.marketLocations', field: 'name', centered }}>
                <Link
                  to={`${url
                    .split('/')
                    .slice(0, -1)
                    .join('/')}/system/market-locations/${marketLocation.id}`}
                >
                  {marketLocation.name}
                </Link>
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
                <Link
                  to={`${url
                    .split('/')
                    .slice(0, -1)
                    .join('/')}/powertakers/${contract.id}`}
                >
                  {contract.fullContractNumber}
                </Link>
              </TwoColView>
              <TwoColView {...{ prefix, field: 'status', centered }}>{billing.status}</TwoColView>
            </Col>
          </Row>
          <div className="title h5">
            <FormattedMessage id={`${prefix}.titleReference`} />
          </div>
          <ReactTable
            {...{
              data,
              columns: referenceColumns,
              getTdProps: (_state, rowInfo, column) => ({
                onClick: (_e, handleOriginal) => {
                  if (column.id === 'meterSerial' && rowInfo.original.linkMeter.length) {
                    history.push(rowInfo.original.linkMeter);
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
      </BillingDetails>
    );
  }
}

interface StatePart {
  billingCycles: { loadingBilling: boolean; billing: { _status: null | number; [key: string]: any } };
}

interface DetailsState {
  minHeight: number;
}

interface ExtProps {
  close: () => void;
  billingId: null | number;
  groupId: string;
  billingCycleId: string;
  marketLocation: any;
  history: any;
  url: string;
}

interface StateProps {
  loading: boolean;
  billing: { _status: null | number; [key: string]: any };
}

interface DispatchProps {
  loadBilling: Function;
  setBilling: Function;
}

function mapStateToProps(state: StatePart) {
  return { loading: state.billingCycles.loadingBilling, billing: state.billingCycles.billing };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {
  loadBilling: BillingCycles.actions.loadBilling,
  setBilling: BillingCycles.actions.setBilling,
})(injectIntl(Details));

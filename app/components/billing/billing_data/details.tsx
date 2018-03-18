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
import { BillingDetails } from './style';
import { formatLabel } from '_util';

class Details extends React.Component<ExtProps & StateProps & DispatchProps & InjectedIntlProps, DetailsState> {
  state = { minHeight: 290 };

  componentDidMount() {
    const { loadBilling, billingId, groupId, billingCycleId } = this.props;
    loadBilling({ billingId, groupId, billingCycleId });
  }

  componentWillReceiveProps(next) {
    const { loadBilling, billingId, groupId, billingCycleId, billing, close, setBilling } = next;

    if (billingId && billing._status && billing._status !== 200) {
      setBilling({ _status: null });
      close();
    }

    if (billingId && billingId !== this.props.billingId) {
      const node = ReactDOM.findDOMNode(this);
      this.setState({ minHeight: node ? node.clientHeight : 290 });
      loadBilling({ billingId, groupId, billingCycleId });
    }
  }

  render() {
    const { close, loading, billing, marketLocation, billingId, url, intl, history, groupId } = this.props;
    const { minHeight } = this.state;

    if (!billingId) return null;

    if (loading || billing._status === null) return <Loading {...{ minHeight, unit: 'px' }} />;
    if (billing._status && billing._status !== 200) return null;

    const { contract } = billing;
    const { customer } = contract;
    const prefix = 'admin.billings';
    const centered = 'true';

    const referenceData = orderBy(billing.items.array, i => moment(i.beginDate).toDate(), 'desc').map(i => ({
      ...i,
      meterSerial: i.meter ? i.meter.productSerialnumber : '',
      linkMeter: i.meter
        ? `${url
          .split('/')
          .slice(0, -1)
          .join('/')}/system/meters/${i.meter.id}`
        : '',
      dates: {
        Display: `${moment(i.beginDate).format('DD.MM.YYYY')} - ${moment(i.endDate).format('DD.MM.YYYY')}`,
        value: moment(i.beginDate).toDate(),
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
        Cell: ({ value: { Display } }) => Display,
      },
      {
        Header: intl.formatMessage({ id: `${prefix}.tableBeginReadingKwh` }),
        accessor: 'beginReadingKwh',
        Cell: ({ value }) => formatLabel(value, 'h'),
      },
      {
        Header: intl.formatMessage({ id: `${prefix}.tableEndReadingKwh` }),
        accessor: 'endReadingKwh',
        Cell: ({ value }) => formatLabel(value, 'h'),
      },
      {
        Header: intl.formatMessage({ id: `${prefix}.tableConsumedEnergyKwh` }),
        accessor: 'consumedEnergyKwh',
        Cell: ({ value }) => formatLabel(value, 'h'),
      },
    ];

    const invoiceData = orderBy(billing.items.array, i => moment(i.beginDate).toDate(), 'desc').map(i => ({
      ...i,
    }));

    return (
      <BillingDetails>
        <div className="wrapper">
          <i className="fa fa-2x fa-close close" onClick={close} />
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
              data: referenceData,
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
            }}
          />
          <div className="title h5">
            <FormattedMessage id={`${prefix}.titleInvoices`} />
          </div>
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

import * as React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import Billings from 'billings';
import { tableParts as TableParts } from 'react_table_config';
import ReactTableSorted from 'components/react_table_sorted';
import BillingStatus from 'components/billing_status';
import Loading from 'components/loading';
import { SpanClick } from 'components/style';
import AddBilling from '../add_billing';

class BillingsList extends React.Component<ExtProps & DispatchProps & StateProps & InjectedIntlProps, ComponentState> {
  state = { isOpen: false };

  switchAddBilling = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  addBilling = (params) => {
    const { addBilling, groupId, contractId } = this.props;

    return new Promise((resolve, reject) => {
      addBilling({ resolve, reject, params, groupId, contractId });
    }).then((res) => {
      this.switchAddBilling();
      return res;
    });
  };

  componentDidMount() {
    const { loadBillings, groupId, contractId } = this.props;
    loadBillings({ groupId, contractId });
  }

  render() {
    const { validationRules, loading, billings, url, intl, groupId, contractId } = this.props;
    const { isOpen } = this.state;

    if (loading || billings._status === null) return <Loading minHeight={40} />;
    if (billings._status && billings._status !== 200) return <Redirect to={url} />;

    const prefix = 'admin.billings';

    const data = billings.array.map(b => ({
      ...b,
      beginDate: { display: moment(b.beginDate).format('DD.MM.YYYY'), value: b.beginDate },
      endDate: { display: moment(b.endDate).format('DD.MM.YYYY'), value: b.endDate },
    }));

    const columns = [
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBeginDate` })} />
        ),
        accessor: 'beginDate',
        sortMethod: TableParts.sort.sortByDateTime,
        Cell: ({ value: { display } }) => display,
      },
      {
        Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableEndDate` })} />,
        accessor: 'endDate',
        sortMethod: TableParts.sort.sortByDateTime,
        Cell: ({ value: { display } }) => display,
      },
      {
        Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableStatus` })} />,
        accessor: 'status',
        Cell: ({ value }) => (
          <span>
            <BillingStatus {...{ status: value, size: 'small' }} /> {value}
          </span>
        ),
      },
    ];

    return (
      <div className="p-0">
        <SpanClick onClick={this.switchAddBilling} className="float-right" data-cy="add billing CTA">
          <FormattedMessage id="admin.billings.addNew" /> <i className="fa fa-plus-circle" />
        </SpanClick>
        <AddBilling
          {...{
            toggle: this.switchAddBilling,
            isOpen,
            validationRules: validationRules.billingCreate,
            onSubmit: this.addBilling,
          }}
        />
        <br />
        <ReactTableSorted
          {...{
            data,
            columns,
            uiSortPath: `groups.${groupId}.contracts.${contractId}.billings`,
          }}
        />
      </div>
    );
  }
}

interface ExtProps {
  groupId: string;
  contractId: string;
  url: string;
}

interface ComponentState {
  isOpen: boolean;
}

interface StatePart {
  billings: {
    loadingBillings: boolean;
    billings: { _status: null | number; array: Array<{ [key: string]: any }> };
    validationRules: { billingCreate: any };
  };
}

interface StateProps {
  loading: boolean;
  billings: { _status: null | number; array: Array<{ [key: string]: any }> };
  validationRules: { billingCreate: any };
}

interface DispatchProps {
  addBilling: Function;
  loadBillings: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    billings: state.billings.billings,
    loading: state.billings.loadingBillings,
    validationRules: state.billings.validationRules,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    addBilling: Billings.actions.addBilling,
    loadBillings: Billings.actions.loadBillings,
  },
)(injectIntl(BillingsList));

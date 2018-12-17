import * as React from 'react';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import { getFormSubmitErrors } from 'redux-form';
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
import NestedDetails from './nested_details';

class BillingsList extends React.Component<ExtProps & DispatchProps & StateProps & InjectedIntlProps, ComponentState> {
  state = { isOpen: false, expanded: {} };

  handleRowClick = (rowNum) => {
    this.setState(() => ({ expanded: { [rowNum]: !this.state.expanded[rowNum] } }));
  };

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

  updateBilling = ({ billingId, params }) => {
    const { updateBilling, groupId, contractId } = this.props;

    return new Promise((resolve, reject) => {
      updateBilling({ resolve, reject, params, groupId, contractId, billingId });
    }).then(res => res);
  };

  componentDidMount() {
    const { loadBillings, groupId, contractId } = this.props;
    loadBillings({ groupId, contractId });
  }

  componentDidUpdate(prevProps) {
    if (isEqual(prevProps.billings, this.props.billings)) return;
    this.setState(() => ({ expanded: {} }));
  }

  render() {
    const { validationRules, loading, billings, url, intl, groupId, contractId, addBillingFormName, addBillingSubmitErrors } = this.props;
    const { isOpen } = this.state;

    if (loading || billings._status === null) return <Loading minHeight={40} />;
    if (billings._status && billings._status !== 200) return <Redirect to={url} />;

    const prefix = 'admin.billings';

    const data = billings.array.map(b => ({
      ...b,
      beginDate: { display: moment(b.beginDate).format('DD.MM.YYYY'), value: b.beginDate },
      lastDate: { display: moment(b.lastDate).format('DD.MM.YYYY'), value: b.lastDate },
    }));

    const columns = [
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableInvoiceNumber` })} />
        ),
        accessor: 'invoiceNumber',
      },
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
        accessor: 'lastDate',
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
      {
        expander: true,
        Expander: row => (
          <div>{row.isExpanded ? <i className="fa fa-chevron-up" /> : <i className="fa fa-chevron-down" />}</div>
        ),
        style: { color: '#bdbdbd' },
      },
    ];

    return (
      <div className="p-0">
        <SpanClick onClick={this.switchAddBilling} className="float-right" data-cy="add billing CTA">
          <FormattedMessage id="admin.billings.addNew" /> <i className="fa fa-plus-circle" />
        </SpanClick>
        <AddBilling
          {...{
            addBillingSubmitErrors,
            form: addBillingFormName,
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
            expanded: this.state.expanded,
            uiSortPath: `groups.${groupId}.contracts.${contractId}.billings`,
            getTrProps: (_state, rowInfo) => ({
              onClick: (_event, handleOriginal) => {
                this.handleRowClick(rowInfo.viewIndex);
                handleOriginal && handleOriginal();
              },
            }),
            SubComponent: row => (
              <NestedDetails
                {...{
                  initialValues: row.original,
                  validationRules: validationRules.billingUpdate,
                  form: `billingUpdateForm${row.original.id}`,
                  onSubmit: params => this.updateBilling({ billingId: row.original.id, params }),
                }}
              />
            ),
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
  expanded: { [key: number]: boolean };
}

interface StatePart {
  billings: {
    loadingBillings: boolean;
    billings: { _status: null | number; array: Array<{ [key: string]: any }> };
    validationRules: { billingCreate: any; billingUpdate: any };
  };
}

interface StateProps {
  loading: boolean;
  billings: { _status: null | number; array: Array<{ [key: string]: any }> };
  validationRules: { billingCreate: any; billingUpdate: any };
}

interface DispatchProps {
  addBilling: Function;
  updateBilling: Function;
  loadBillings: Function;
}

function mapStateToProps(state: StatePart) {
  const addBillingFormName = 'addBilling';

  return {
    billings: state.billings.billings,
    loading: state.billings.loadingBillings,
    validationRules: state.billings.validationRules,
    addBillingFormName,
    addBillingSubmitErrors: getFormSubmitErrors(addBillingFormName)(state),
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    addBilling: Billings.actions.addBilling,
    updateBilling: Billings.actions.updateBilling,
    loadBillings: Billings.actions.loadBillings,
  },
)(injectIntl(BillingsList));

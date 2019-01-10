import * as React from 'react';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { getFormSubmitErrors } from 'redux-form';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import Billings from 'billings';
import Contracts from 'contracts';
import Tariffs from 'tariffs';
import { tableParts as TableParts } from 'react_table_config';
import ReactTableSorted from 'components/react_table_sorted';
import BillingStatus from 'components/billing_status';
import Loading from 'components/loading';
import { SpanClick } from 'components/style';
import AddBilling from '../add_billing';
import NestedDetails from './nested_details';
import AttachedTariffs from 'components/attached_tariffs';

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
    const { loadContract, loadBillings, loadTariffs, groupId, contractId } = this.props;
    loadBillings({ groupId, contractId });
    loadContract({ groupId, contractId });
    loadTariffs(groupId);
  }

  componentDidUpdate(prevProps) {
    if (isEqual(prevProps.billings, this.props.billings)) return;
    this.setState(() => ({ expanded: {} }));
  }

  render() {
    const {
      validationRules,
      loading,
      billings,
      contract,
      tariffs,
      url,
      intl,
      groupId,
      contractId,
      updateContract,
      addBillingFormName,
      addBillingSubmitErrors,
    } = this.props;
    const { isOpen } = this.state;

    if (loading || !billings._status || !contract._status || !tariffs._status) return <Loading minHeight={40} />;
    if (billings._status !== 200 || contract._status !== 200 || tariffs._status !== 200) return <Redirect to={url} />;

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
        className: 'cy-invoice-number',
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBeginDate` })} />
        ),
        accessor: 'beginDate',
        className: 'cy-begin-date',
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

    // HACK: please, replace it with proper error handling
    const addBillingPreconditions = {
      registerMeta: 'Please, create a meter and attach to this contract',
      tariffs: 'Please, do something with tariffs',
    };

    return (
      <div className="p-0">
        <AttachedTariffs
          {...{
            title: 'Contract tariffs',
            tariffs: tariffs.array,
            attachedTariffs: contract.tariffs.array,
            updateList: ({ resolve, reject, tariffIds }) => updateContract({ resolve, reject, params: { tariffIds, updatedAt: contract.updatedAt }, groupId, contractId, updateType: 'tariffs' }),
          }}
        />
        <h4>Billings:</h4>
        {contract.allowedActions.createBilling === true ? (
          <SpanClick onClick={this.switchAddBilling} className="float-right" data-cy="add billing CTA">
            <FormattedMessage id="admin.billings.addNew" /> <i className="fa fa-plus-circle" />
          </SpanClick>
        ) : (
          Object.keys(addBillingPreconditions).reduce(
            (e, k) => (get(contract.allowedActions.createBilling, k) ? `${e ? `${e}, ` : ''}${addBillingPreconditions[k]}` : e),
            '',
          )
        )}
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
                  billing: row.original,
                  initialValues: row.original,
                  validationRules: validationRules.billingUpdate,
                  form: `billingUpdateForm${row.original.id}`,
                  onSubmit: params => this.updateBilling({
                    billingId: row.original.id,
                    params: {
                      status: params.status,
                      invoiceNumber: params.invoiceNumber,
                      updatedAt: params.updatedAt,
                    },
                  }),
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
  contracts: {
    loadingContract: boolean;
    contract: { _status: null | number; [key: string]: any };
  };
  tariffs: {
    loadingTariffs: boolean;
    tariffs: { _status: null | number; array: Array<{ [key: string]: any }> };
  };
}

interface StateProps {
  loading: boolean;
  billings: { _status: null | number; array: Array<{ [key: string]: any }> };
  validationRules: { billingCreate: any; billingUpdate: any };
  contract: { _status: null | number; [key: string]: any };
  tariffs: { _status: null | number; array: Array<{ [key: string]: any }> };
}

interface DispatchProps {
  addBilling: Function;
  updateBilling: Function;
  loadBillings: Function;
  loadContract: Function;
  updateContract: Function;
  loadTariffs: Function;
}

function mapStateToProps(state: StatePart) {
  const addBillingFormName = 'addBilling';

  return {
    billings: state.billings.billings,
    loading: state.billings.loadingBillings || state.contracts.loadingContract || state.tariffs.loadingTariffs,
    validationRules: state.billings.validationRules,
    contract: state.contracts.contract,
    addBillingFormName,
    addBillingSubmitErrors: getFormSubmitErrors(addBillingFormName)(state),
    tariffs: state.tariffs.tariffs,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    addBilling: Billings.actions.addBilling,
    updateBilling: Billings.actions.updateBilling,
    loadBillings: Billings.actions.loadBillings,
    loadContract: Contracts.actions.loadContract,
    updateContract: Contracts.actions.updateContract,
    loadTariffs: Tariffs.actions.loadTariffs,
  },
)(injectIntl(BillingsList));

import * as React from 'react';
import moment from 'moment';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { getFormSubmitErrors } from 'redux-form';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import Billings from 'billings';
import Contracts from 'contracts';
import Tariffs from 'tariffs';
import MarketLocations from 'market_locations';
import { tableParts as TableParts } from 'react_table_config';
import ReactTableSorted from 'components/react_table_sorted';
import BillingStatus from 'components/billing_status';
import Loading from 'components/loading';
import { SpanClick } from 'components/style';
import AttachedTariffs from 'components/attached_tariffs';
import ActionsErrors from 'components/actions_errors';
import Registers from 'components/system/market_location_data/registers';
import BillingDetails from 'components/billing_details';
import AddBilling from '../add_billing';

const DefaultPerson = require('images/default_person.jpg');
const DefaultOrganisation = require('images/default_organisation.jpg');
const DefaultThirdParty = require('images/default_3rd_party.jpg');

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

  componentDidMount() {
    const { loadContract, loadBillings, loadTariffs, groupId, contractId, loadMarketLocations } = this.props;
    loadBillings({ groupId, contractId });
    loadContract({ groupId, contractId });
    loadTariffs(groupId);
    loadMarketLocations(groupId);
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
      billingsUrl,
      history,
      intl,
      groupId,
      contractId,
      loadContract,
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
      name:
        contract.type === 'contract_localpool_third_party'
          ? { value: 'drittbeliefert', image: DefaultThirdParty, type: 'avatar' }
          : contract.customer.type === 'person'
            ? {
              value: `${contract.customer.lastName} ${contract.customer.firstName}`,
              image: contract.customer.image || DefaultPerson,
              type: 'avatar',
              clickable: true,
            }
            : {
              value: contract.customer.name,
              image: contract.customer.image || DefaultOrganisation,
              type: 'avatar',
              clickable: true,
            },
      contract: { ...contract, billings: null },
      beginDateObj: { display: moment(b.beginDate).format('DD.MM.YYYY'), value: b.beginDate },
      lastDateObj: { display: moment(b.lastDate).format('DD.MM.YYYY'), value: b.lastDate },
    }));

    const columns = [
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableInvoiceNumber` })} />
        ),
        accessor: 'fullInvoiceNumber',
        className: 'cy-invoice-number',
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableBeginDate` })} />
        ),
        accessor: 'beginDateObj',
        className: 'cy-begin-date',
        sortMethod: TableParts.sort.sortByDateTime,
        Cell: ({ value: { display } }) => display,
      },
      {
        Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableEndDate` })} />,
        accessor: 'lastDateObj',
        sortMethod: TableParts.sort.sortByDateTime,
        Cell: ({ value: { display } }) => display,
      },
      {
        Header: () => <TableParts.components.headerCell title={intl.formatMessage({ id: `${prefix}.tableStatus` })} />,
        accessor: 'status',
        sortMethod: TableParts.sort.sortByBillingstatus,
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
        <div style={{ color: contract.allowedActions.createBilling.tariffs ? 'red' : 'black' }}>
          <AttachedTariffs
            {...{
              title: 'Contract tariffs',
              tariffs: tariffs.array,
              attachedTariffs: contract.tariffs.array,
              updateList: ({ resolve, reject, tariffIds }) => updateContract({
                resolve,
                reject,
                params: { tariffIds, updatedAt: contract.updatedAt },
                groupId,
                contractId,
                updateType: 'tariffs',
              }),
            }}
          />
        </div>
        <h4>Billings:</h4>
        {contract.allowedActions.createBilling === true ? (
          <SpanClick onClick={this.switchAddBilling} className="float-right" data-cy="add billing CTA">
            <FormattedMessage id="admin.billings.addNew" /> <i className="fa fa-plus-circle" />
          </SpanClick>
        ) : (
          <React.Fragment>
            <ActionsErrors {...{ actions: contract.allowedActions.createBilling }} />
            {!!contract.allowedActions.createBilling.registerMeta && (
              <div style={{ color: 'red' }}>
                {get(contract, 'registerMeta.registers.array', []).length ? (
                  <React.Fragment>
                    <h5>Registers:</h5>
                    <Registers
                      {...{
                        url: `/groups/${groupId}/market-locations`,
                        history,
                        groupId,
                        withAddReading: true,
                        cb: () => loadContract({ groupId, contractId }),
                        locationId: contract.registerMeta.id,
                        registers: get(contract, 'registerMeta.registers.array', []).filter(
                          r => !r.readings.array.length
                            || !r.readings.array.find(re => ['IOM', 'COM1'].includes(re.reason)),
                        ),
                      }}
                    />
                  </React.Fragment>
                ) : (
                  <Link to={`${billingsUrl}/add-meter`} data-cy="add malo CTA">
                    <FormattedMessage id="admin.meters.addNew" /> <i className="fa fa-plus-circle" />
                  </Link>
                )}
              </div>
            )}
          </React.Fragment>
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
        {!!data.length && (
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
                  <BillingDetails
                    {...{
                      groupId,
                      contractId,
                      billingId: row.original.id,
                      extContract: contract,
                      extBilling: row.original,
                      history,
                    }}
                  />
              ),
            }}
          />
        )}
      </div>
    );
  }
}

interface ExtProps {
  groupId: string;
  contractId: string;
  url: string;
  billingsUrl: string;
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
  loadBillings: Function;
  loadContract: Function;
  updateContract: Function;
  loadTariffs: Function;
  loadMarketLocations: Function;
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
    loadBillings: Billings.actions.loadBillings,
    loadContract: Contracts.actions.loadContract,
    updateContract: Contracts.actions.updateContract,
    loadTariffs: Tariffs.actions.loadTariffs,
    loadMarketLocations: MarketLocations.actions.loadMarketLocations,
  },
)(injectIntl(BillingsList));

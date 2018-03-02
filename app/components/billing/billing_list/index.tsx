import * as React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import Groups from 'groups';
import BillingCycles from 'billing_cycles';
import ReactTableSorted from 'components/react_table_sorted';
import { tableParts as TableParts } from 'react_table_config';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SpanClick } from 'components/style';
import AddBilling from '../add_billing';

class BillingList extends React.Component<
  ExtProps & StateProps & DispatchProps & InjectedIntlProps & BreadcrumbsProps,
  BillingState
  > {
  state = { isOpen: false };

  componentDidMount() {
    const { loadGroup, loadBillingCycles, groupId } = this.props;
    loadBillingCycles(groupId);
    loadGroup(groupId);
  }

  switchAddBilling() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  addBillingCycle(values) {
    const { addBillingCycle, groupId } = this.props;

    return new Promise((resolve, reject) => {
      addBillingCycle({ resolve, reject, params: values, groupId });
    }).then(() => this.switchAddBilling());
  }

  render() {
    const { billingCycles, nextBillingCycleBeginDate, loading, intl, breadcrumbs, groupId } = this.props;
    const { isOpen } = this.state;

    const data = billingCycles.array.map(b => ({
      ...b,
      dates: `${moment(b.beginDate).format('DD.MM.YYYY')} - ${moment(b.lastDate).format('DD.MM.YYYY')}`,
    }));

    const columns = [
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.billingCycles.tableName' })} />
        ),
        accessor: 'name',
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.billingCycles.tableDates' })} />
        ),
        accessor: 'dates',
      },
    ];

    return (
      <React.Fragment>
        <PageTitle
          {...{
            breadcrumbs: breadcrumbs.concat([
              { id: '-----', title: intl.formatMessage({ id: 'admin.breadcumbs.billingCycles' }) },
            ]),
            title: intl.formatMessage({ id: 'admin.billingCycles.backBillingCycles' }),
          }}
        />
        <CenterContent>
          <SpanClick onClick={this.switchAddBilling.bind(this)} className="float-right">
            <FormattedMessage id="admin.billingCycles.addNew" /> <i className="fa fa-plus-circle" />
          </SpanClick>
          <AddBilling
            {...{
              isOpen,
              toggle: this.switchAddBilling.bind(this),
              loading,
              onSubmit: this.addBillingCycle.bind(this),
              nextBillingCycleBeginDate,
            }}
          />
          <div className="clearfix" />
          <div className="p-0">
            <ReactTableSorted
              {...{
                data,
                columns,
                uiSortPath: `groups.${groupId}.billingCycles`,
              }}
            />
          </div>
        </CenterContent>
      </React.Fragment>
    );
  }
}

interface StatePart {
  billingCycles: { billingCycles: { _status: null | number; array: Array<any> }; loadingBillingCycles: boolean };
  groups: { group: { nextBillingCycleBeginDate: string }; loadingGroup: boolean };
}

interface BillingState {
  isOpen: boolean;
}

interface ExtProps {
  groupId: string;
}

interface StateProps {
  billingCycles: { _status: null | number; array: Array<any> };
  nextBillingCycleBeginDate: string;
  loading: boolean;
}

interface DispatchProps {
  loadBillingCycles: Function;
  setBillingCycles: Function;
  loadGroup: Function;
  addBillingCycle: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    billingCycles: state.billingCycles.billingCycles,
    nextBillingCycleBeginDate: state.groups.group.nextBillingCycleBeginDate,
    loading: state.groups.loadingGroup || state.billingCycles.loadingBillingCycles,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {
  loadBillingCycles: BillingCycles.actions.loadBillingCycles,
  setBillingCycles: BillingCycles.actions.setBillingCycles,
  loadGroup: Groups.actions.loadGroup,
  addBillingCycle: BillingCycles.actions.addBillingCycle,
})(injectIntl(BillingList));

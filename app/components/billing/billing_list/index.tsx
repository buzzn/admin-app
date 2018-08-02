import * as React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import orderBy from 'lodash/orderBy';
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

  switchAddBilling = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  addBillingCycle = (params) => {
    const { addBillingCycle, groupId } = this.props;

    return new Promise((resolve, reject) => {
      addBillingCycle({ resolve, reject, params, groupId });
    }).then(() => this.switchAddBilling());
  };

  render() {
    const {
      billingCycles,
      nextBillingCycleBeginDate,
      loading,
      intl,
      breadcrumbs,
      groupId,
      groupName,
      groupStartDate,
      url,
      history,
      validationRules,
    } = this.props;
    const { isOpen } = this.state;

    const data = orderBy(billingCycles.array, b => moment(b.beginDate).toDate(), 'desc').map(b => ({
      ...b,
      dates: {
        Display: `${moment(b.beginDate).format('DD.MM.YYYY')} - ${moment(b.lastDate).format('DD.MM.YYYY')}`,
        value: moment(b.beginDate).toDate(),
      },
      billingCycleLink: `${url}/${b.id}`,
    }));

    const columns = [
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.billingCycles.tableName' })} />
        ),
        accessor: 'name',
        style: {
          cursor: 'pointer',
          textDecoration: 'underline',
        },
      },
      {
        Header: () => (
          <TableParts.components.headerCell title={intl.formatMessage({ id: 'admin.billingCycles.tableDates' })} />
        ),
        accessor: 'dates',
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
        Cell: ({ value: { Display } }) => Display,
      },
    ];

    return (
      <React.Fragment>
        <PageTitle
          {...{
            breadcrumbs: breadcrumbs.concat([
              { id: 1, link: `/groups/${groupId}`, title: groupName },
              { id: '-----', title: intl.formatMessage({ id: 'admin.breadcumbs.billingCycles' }) },
            ]),
            title: intl.formatMessage({ id: 'admin.billingCycles.backBillingCycles' }),
          }}
        />
        <CenterContent>
          {groupStartDate ? (
            <SpanClick onClick={this.switchAddBilling} className="float-right">
              <FormattedMessage id="admin.billingCycles.addNew" /> <i className="fa fa-plus-circle" />
            </SpanClick>
          ) : (
            <span style={{ float: 'right' }}>?? Message about unfinished group.</span>
          )}
          <AddBilling
            {...{
              isOpen,
              toggle: this.switchAddBilling,
              loading,
              onSubmit: this.addBillingCycle,
              nextBillingCycleBeginDate,
              validationRules,
            }}
          />
          <div className="clearfix" />
          <div className="p-0">
            <ReactTableSorted
              {...{
                data,
                columns,
                getTdProps: (_state, rowInfo, column) => ({
                  onClick: (_e, handleOriginal) => {
                    if (column.id === 'name') {
                      history.push(rowInfo.original.billingCycleLink);
                    }
                    if (handleOriginal) handleOriginal();
                  },
                }),
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
  billingCycles: {
    billingCycles: { _status: null | number; array: Array<any> };
    loadingBillingCycles: boolean;
    validationRules: { _status: null | number; [key: string]: any };
  };
  groups: {
    group: { nextBillingCycleBeginDate: string; name: string; startDate: null | string };
    loadingGroup: boolean;
  };
}

interface BillingState {
  isOpen: boolean;
}

interface ExtProps {
  groupId: string;
  url: string;
  history: any;
}

interface StateProps {
  billingCycles: { _status: null | number; array: Array<any> };
  validationRules: { _status: null | number; [key: string]: any };
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
    validationRules: state.billingCycles.validationRules,
    groupName: state.groups.group.name,
    groupStartDate: state.groups.group.startDate,
    nextBillingCycleBeginDate: state.groups.group.nextBillingCycleBeginDate,
    loading: state.groups.loadingGroup || state.billingCycles.loadingBillingCycles,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    loadBillingCycles: BillingCycles.actions.loadBillingCycles,
    setBillingCycles: BillingCycles.actions.setBillingCycles,
    loadGroup: Groups.actions.loadGroup,
    addBillingCycle: BillingCycles.actions.addBillingCycle,
  },
)(injectIntl(BillingList));

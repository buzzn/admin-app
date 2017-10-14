// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { intlShape } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';
import Contracts from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'new_components/breadcrumbs';

type Props = {
  // TODO: replace with action
  loadGroup: Function,
  loadGroupContracts: Function,
  contracts: Array<Object>,
  group: Object,
  loading: boolean,
  match: { params: { groupId: string } },
  intl: intlShape,
};

export class ContractsList extends React.Component<Props> {
  static defaultProps = {
    contracts: [],
  };

  componentWillMount() {
    const { loadGroupContracts, loadGroup, group, match: { params: { groupId } } } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
    loadGroupContracts(groupId);
  }

  render() {
    const { contracts, group, loading, match: { params: { groupId } }, intl } = this.props;

    if (loading || !group.id) return (<div>Loading...</div>);

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/contracts`, title: group.name },
      { id: '-----', title: 'Contracts' },
    ];

    const data = contracts.filter(c => !!c.id).map(c => ({
      ...c,
      type: intl.formatMessage({ id: `admin.contracts.${c.type}` }),
      status: c.status,
      since: c.signingDate,
      number: c.fullContractNumber,
      link: `/localpools/${groupId}/contracts/${c.id}`,
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.contracts.tableType' }) }/>,
        accessor: 'type',
        minWidth: 200,
      },
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.contracts.tableStatus' }) }/>,
        accessor: 'status',
        minWidth: 200,
      },
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.contracts.tableSince' }) }/>,
        accessor: 'since',
        minWidth: 100,
      },
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.contracts.tableNumber' }) }/>,
        accessor: 'number',
        minWidth: 200,
      },
      {
        Header: '',
        accessor: 'link',
        sortable: false,
        filterable: false,
        resizable: false,
        width: 100,
        Cell: () => <TableParts.components.iconCell icon="cog"/>,
      },
    ];

    return [
      <div className="center-content-header" key={ 1 }>
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <p className="h4"><FormattedMessage id="admin.contracts.headerGroupContracts"/></p>
      </div>,
      <div className="p-0" key={ 2 }>
        <ReactTable {...{ data, columns }} />
      </div>,
    ];
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    contracts: state.contracts.groupContracts,
    loading: state.contracts.loadingGroupContracts,
  };
}

export default connect(mapStateToProps, {
  loadGroupContracts: Contracts.actions.loadGroupContracts,
  loadGroup: Groups.actions.loadGroup,
})(injectIntl(ContractsList));

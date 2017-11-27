// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { intlShape } from 'react-intl';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import Groups from 'groups';
import type { GroupsStats } from 'groups/reducers';
import { tableParts as TableParts } from 'react_table_config';

import DefaultImage from 'images/energygroup_noimage_01.jpg';

type Props = {
  // TODO: proper action type
  loadGroups: Function,
  groups: Array<Object>,
  groupsStats: GroupsStats,
  intl: intlShape,
  history: Object,
};

class LocalpoolsList extends React.Component<Props> {
  static defaultProps = {
    groups: [],
  };

  componentWillMount() {
    this.props.loadGroups();
  }

  render() {
    const { groups, groupsStats, intl, history } = this.props;

    const data = sortBy(groups, 'name').map(g => ({
      ...g,
      nameWithImage: { value: g.name, image: g.image || DefaultImage, type: 'group' },
      energyTypes: groupsStats[g.id] || {},
      incomplete: g.incompleteness && Object.keys(g.incompleteness).length,
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.groups.tableName' }) }/>,
        accessor: 'nameWithImage',
        resizable: true,
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
        Cell: TableParts.components.iconNameCell,
      },
      {
        Header: () => <FormattedMessage id="admin.groups.tableEnergyType"/>,
        accessor: 'energyTypes',
        Cell: TableParts.components.energyTypesCell,
        sortable: false,
        filterable: false,
        resizable: true,
      },
      {
        Header: '',
        accessor: 'incomplete',
        sortable: false,
        filterable: false,
        resizable: true,
        Cell: TableParts.components.incompleteCell,
      },
    ];

    return (
      <div>
        <div className="center-content-header">
          <p className="h3" style={{ lineHeight: '68px', margin: 0 }}><FormattedMessage id="admin.groups.headerGroupsList"/></p>
        </div>
        <ReactTable {...{
          data,
          columns,
          getTrProps: (state, rowinfo) => ({
            onClick: () => {
              history.push(`/localpools/${rowinfo.original.id}`);
            },
            style: {
              cursor: 'pointer',
            },
          }),
        }} />
      </div>
    );
  }
}

export const LocalpoolsListIntl = injectIntl(LocalpoolsList);

function mapStateToProps(state) {
  return {
    groups: filter(state.groups.groups.array, group => group.type === 'group_localpool'),
    groupsStats: state.groups.groupsStats,
  };
}

export default connect(mapStateToProps, {
  loadGroups: Groups.actions.loadGroups,
})(LocalpoolsListIntl);

// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { injectIntl } from 'react-intl';
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
  myProfile: { firstName: string, lastName: string },
  groups: Array<Object>,
  groupsStats: GroupsStats,
  intl: intlShape,
  history: Object,
};

class LocalpoolsList extends React.Component<Props> {
  static defaultProps = {
    groups: [],
    myProfile: { firstName: '', lastName: '' },
  };

  componentWillMount() {
    this.props.loadGroups();
  }

  render() {
    const { myProfile: { firstName, lastName }, groups, groupsStats, intl, history } = this.props;

    const data = sortBy(groups, 'name').map(g => ({
      ...g,
      nameWithImage: { value: g.name, image: g.image || DefaultImage, type: 'group' },
      energyTypes: groupsStats[g.id] || {},
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.groups.tableName' }) }/>,
        accessor: 'nameWithImage',
        width: 500,
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
        Cell: TableParts.components.iconNameCell,
      },
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.groups.tableEnergyType' }) }/>,
        accessor: 'energyTypes',
        Cell: TableParts.components.energyTypesCell,
        sortable: false,
        filterable: false,
        resizable: false,
        width: 100,
      },
    ];

    return (
      <div>
        <p className="h4">{ `${firstName} ${lastName}` }</p>
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
    myProfile: state.app.userMe,
    groups: filter(state.groups.groups.array, group => group.type === 'group_localpool'),
    groupsStats: state.groups.groupsStats,
  };
}

export default connect(mapStateToProps, {
  loadGroups: Groups.actions.loadGroups,
})(LocalpoolsListIntl);

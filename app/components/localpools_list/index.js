// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import filter from 'lodash/filter';
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
  match: { url: string },
  intl: intlShape,
};

export class LocalpoolsList extends React.Component<Props> {
  static defaultProps = {
    groups: [],
    myProfile: { firstName: '', lastName: '' },
  };

  componentWillMount() {
    this.props.loadGroups();
  }

  render() {
    const { myProfile: { firstName, lastName }, groups, groupsStats, match: { url }, intl } = this.props;

    const data = groups.map(g => ({
      ...g,
      nameWithImage: { value: g.name, image: g.image || DefaultImage },
      energyTypes: groupsStats[g.id] || {},
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.groups.name' }) }/>,
        accessor: 'nameWithImage',
        minWidth: 200,
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
        Cell: TableParts.components.partyNameCell,
      },
      {
        Header: () => <TableParts.components.headerCell title={ intl.formatMessage({ id: 'admin.groups.energyType' }) }/>,
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
        <ReactTable {...{ data, columns }} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    myProfile: state.app.userMe,
    groups: filter(state.groups.groups.array, group => group.type === 'group_localpool'),
    groupsStats: state.groups.groupsStats,
  };
}

export default connect(mapStateToProps, {
  loadGroups: Groups.actions.loadGroups,
})(injectIntl(LocalpoolsList));

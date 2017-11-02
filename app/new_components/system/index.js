// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import { tableParts as TableParts } from 'react_table_config';
import Meters from 'meters';
import Groups from 'groups';
import Breadcrumbs from 'new_components/breadcrumbs';

type Props = {
  loading: boolean,
  meters: Array<Object>,
  group: Object,
  // TODO: replace with action
  loadGroupMeters: Function,
  loadGroup: Function,
  intl: intlShape,
  match: { params: { groupId: string } },
};

export class System extends React.Component<Props> {
  static defaultProps = {
    meters: [],
  };

  componentWillMount() {
    const { loadGroupMeters, loadGroup, group, match: { params: { groupId } } } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
    loadGroupMeters(groupId);
  }

  render() {
    const { loading, meters, group, match: { params: { groupId } }, intl } = this.props;

    if (loading || !group.id) return (<div>Loading...</div>);

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/system`, title: group.name },
      { id: '-----', title: 'Meters' },
    ];

    const data = meters.map(m => ({
      ...m,
      type: intl.formatMessage({ id: `admin.meters.${m.type}` }),
      meter: m.productSerialnumber,
      link: `/localpools/${groupId}/system/${m.id}`,
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title="Type"/>,
        accessor: 'type',
        minWidth: 200,
      },
      {
        Header: () => <TableParts.components.headerCell title="Meter"/>,
        accessor: 'meter',
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
        <p className="h4">System setup</p>
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
    loading: state.meters.loadingGroupMeters,
    meters: state.meters.groupMeters,
  };
}

export default connect(mapStateToProps, {
  loadGroupMeters: Meters.actions.loadGroupMeters,
  loadGroup: Groups.actions.loadGroup,
})(injectIntl(System));
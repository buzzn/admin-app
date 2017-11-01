// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Contracts from 'contracts';
import Groups from 'groups';
import { tableParts as TableParts } from 'react_table_config';
import Breadcrumbs from 'new_components/breadcrumbs';

import './style.scss';
import DefaultPerson from '../../images/default_person.jpg';

type Props = {
  // TODO: replace with action
  loadGroup: Function,
  loadGroupPowertakers: Function,
  powertakers: Array<Object>,
  group: Object,
  loading: boolean,
  match: { params: { groupId: string } },
};

export class Powertakers extends React.Component<Props> {
  static defaultProps = {
    powertakers: [],
  };

  componentWillMount() {
    const { loadGroupPowertakers, loadGroup, group, match: { params: { groupId } } } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
    loadGroupPowertakers(groupId);
  }

  render() {
    const { powertakers, match: { params: { groupId } }, loading, group } = this.props;

    if (loading || !group.id) return (<div>Loading...</div>);

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/powertakers`, title: group.name },
      { id: '-----', title: 'Powertakers' },
    ];

    const data = powertakers.map(p => ({
      ...p,
      name: p.type === 'person' ? { value: `${p.firstName} ${p.lastName}`, image: p.image || DefaultPerson } : { value: p.name },
      location: 'Location',
      link: `/localpools/${groupId}/powertakers/${p.contractId}`,
    }));

    const columns = [
      {
        Header: () => <TableParts.components.headerCell title="Name"/>,
        accessor: 'name',
        minWidth: 200,
        filterMethod: TableParts.filters.filterByValue,
        sortMethod: TableParts.sort.sortByValue,
        Cell: TableParts.components.partyNameCell,
      },
      {
        Header: () => <TableParts.components.headerCell title="Location"/>,
        accessor: 'location',
        minWidth: 200,
      },
      {
        Header: '',
        accessor: 'link',
        sortable: false,
        filterable: false,
        resizable: false,
        width: 100,
        Cell: () => <TableParts.components.iconCell icon="cog" action={ () => {} }/>,
      },
    ];

    return [
      <div className="center-content-header" key={ 1 }>
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <p className="h4">Powertakers</p>
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
    powertakers: state.contracts.groupPowertakers,
    loading: state.contracts.loadingGroupPowertakers,
  };
}

export default connect(mapStateToProps, {
  loadGroupPowertakers: Contracts.actions.loadGroupPowertakers,
  loadGroup: Groups.actions.loadGroup,
})(Powertakers);

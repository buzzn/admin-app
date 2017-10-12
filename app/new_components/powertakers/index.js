// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Contracts from 'contracts';
import { tableParts } from 'react_table_config';

import './style.scss';
import DefaultPerson from '../../images/default_person.jpg';

type Props = {
  // TODO: replace with action
  loadGroupPowertakers: Function,
  powertakers: Array<Object>,
  loading: boolean,
  match: { params: { groupId: string } },
};

export class Powertakers extends React.Component<Props> {
  static defaultProps = {
    powertakers: [],
  };

  componentWillMount() {
    const { loadGroupPowertakers, match: { params: { groupId } } } = this.props;
    loadGroupPowertakers(groupId);
  }

  render() {
    const { powertakers, match: { params: { groupId } }, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    const data = powertakers.map(p => ({
      ...p,
      name: p.type === 'person' ? { value: `${p.firstName} ${p.lastName}`, image: p.image || DefaultPerson } : { value: p.name },
      location: 'Location',
      link: `/localpools/${groupId}/powertakers/${p.contractId}`,
    }));

    const columns = [
      {
        Header: 'Name',
        accessor: 'name',
        minWidth: 200,
        filterMethod: tableParts.filters.filterByValue,
        sortMethod: tableParts.sort.sortByValue,
        Cell: tableParts.components.partyNameCell,
      },
      {
        Header: 'Location',
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
        Cell: tableParts.components.linkCell,
      },
    ];

    return [
      <div key={ 1 }>
        <h5>Powertakers</h5>
        <p>{ powertakers.length } powertakers</p>
      </div>,
      <div className="p-0" key={ 2 }>
        <ReactTable {...{ data, columns }} />
      </div>,
    ];
  }
}

function mapStateToProps(state) {
  return {
    powertakers: state.contracts.groupPowertakers,
    loading: state.contracts.loadingGroupPowertakers,
  };
}

export default connect(mapStateToProps, { loadGroupPowertakers: Contracts.actions.loadGroupPowertakers })(Powertakers);

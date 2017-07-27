import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Contracts from 'contracts';
import { tableParts } from 'react_table_config';

import './style.scss';

export class Powertakers extends Component {
  static propTypes = {
    loadGroupPowertakers: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    powertakers: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    powertakers: [],
  };

  componentWillMount() {
    const { loadGroupPowertakers, groupId } = this.props;
    loadGroupPowertakers(groupId);
  }

  render() {
    const { powertakers, groupId, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    const data = powertakers.map(p => ({
      ...p,
      name: p.type === 'person' ? { value: `${p.firstName} ${p.lastName}`, image: p.image } : { value: p.name },
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

    return (
      <div className="row">
        <div className="col-12">
          <h5>Powertakers</h5>
          <p>{ powertakers.length } powertakers</p>
        </div>
        <div className="col-12 no-padding">
          <ReactTable {...{ data, columns }} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    powertakers: state.contracts.groupPowertakers,
    loading: state.contracts.loadingGroupPowertakers,
  };
}

export default connect(mapStateToProps, { loadGroupPowertakers: Contracts.actions.loadGroupPowertakers })(Powertakers);

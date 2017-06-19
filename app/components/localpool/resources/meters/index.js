import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { tableParts } from 'react_table_config';
import Meters from 'meters';

export class MetersList extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    meters: PropTypes.array.isRequired,
    loadGroupMeters: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    meters: [],
  };

  componentWillMount() {
    const { loadGroupMeters, groupId } = this.props;
    loadGroupMeters(groupId);
  }

  render() {
    const { loading, meters, groupId } = this.props;

    if (loading) return (<div>Loading...</div>);

    const data = meters.map(m => ({
      ...m,
      meter: m.manufacturerProductSerialnumber,
      description: '',
      link: `/localpools/${groupId}/system/${m.id}`,
    }));

    const columns = [
      {
        Header: 'Meter',
        accessor: 'meter',
        minWidth: 200,
      },
      {
        Header: 'Description',
        accessor: 'description',
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
          <h5>System setup</h5>
          List of all <strong>meters</strong> in your local pool.
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
    loading: state.meters.loadingGroupMeters,
    meters: state.meters.groupMeters,
  };
}

export default connect(mapStateToProps, { loadGroupMeters: Meters.actions.loadGroupMeters })(MetersList);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { injectIntl } from 'react-intl';
import { tableParts } from 'react_table_config';
import Meters from 'meters';

export class MetersList extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    meters: PropTypes.array.isRequired,
    loadGroupMeters: PropTypes.func.isRequired,
  };

  static defaultProps = {
    meters: [],
  };

  componentWillMount() {
    const { loadGroupMeters, match: { params: { groupId } } } = this.props;
    loadGroupMeters(groupId);
  }

  render() {
    const { loading, meters, match: { params: { groupId } }, intl } = this.props;

    if (loading) return (<div>Loading...</div>);

    const data = meters.map(m => ({
      ...m,
      type: intl.formatMessage({ id: `admin.meters.${m.type}` }),
      meter: m.productSerialnumber,
      link: `/localpools/${groupId}/system/${m.id}`,
    }));

    const columns = [
      {
        Header: 'Type',
        accessor: 'type',
        minWidth: 200,
      },
      {
        Header: 'Meter',
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
        Cell: tableParts.components.linkCell,
      },
    ];

    return [
      <div key={ 1 }>
        <h5>System setup</h5>
        List of all <strong>meters</strong> in your local pool.
      </div>,
      <div className="p-0" key={ 2 }>
        <ReactTable {...{ data, columns }} />
      </div>,
    ];
  }
}

function mapStateToProps(state) {
  return {
    loading: state.meters.loadingGroupMeters,
    meters: state.meters.groupMeters,
  };
}

export default connect(mapStateToProps, { loadGroupMeters: Meters.actions.loadGroupMeters })(injectIntl(MetersList));

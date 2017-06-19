import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { tableParts } from 'react_table_config';
import Contracts from 'contracts';

export class ContractsList extends Component {
  static propTypes = {
    loadGroupContracts: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    contracts: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    contracts: [],
  };

  componentWillMount() {
    const { loadGroupContracts, groupId } = this.props;
    loadGroupContracts(groupId);
  }

  render() {
    const { contracts, loading, groupId } = this.props;

    if (loading) return (<div>Loading...</div>);

    const contractType = (contract) => {
      switch (contract.type) {
        case 'contract_metering_point_operator':
          return 'Metering Point Operator';
        case 'contract_localpool_processing':
          return 'LCP processing';
        default:
          return 'Unknown';
      }
    };

    const data = contracts.filter(c => !!c.id).map(c => ({
      ...c,
      type: contractType(c),
      since: c.signingDate,
      number: c.contractNumber,
      link: `/localpools/${groupId}/contracts/${c.id}`,
    }));

    const columns = [
      {
        Header: 'Type',
        accessor: 'type',
        minWidth: 200,
      },
      {
        Header: 'Since',
        accessor: 'since',
        minWidth: 100,
      },
      {
        Header: 'Contract #',
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
        Cell: tableParts.components.linkCell,
      },
    ];

    return (
      <div className="row">
        <div className="col-12">
          <h5>Contracts</h5>
          <p>List all contracts for the loacalpool</p>
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
    contracts: state.contracts.groupContracts,
    loading: state.contracts.loadingGroupContracts,
  };
}

export default connect(mapStateToProps, { loadGroupContracts: Contracts.actions.loadGroupContracts })(ContractsList);

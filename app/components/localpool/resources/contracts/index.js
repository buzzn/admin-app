import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Contracts from 'contracts';

export class ContractsList extends Component {
  static propTypes = {
    loadGroupContracts: React.PropTypes.func.isRequired,
    groupId: React.PropTypes.string.isRequired,
    contracts: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired,
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
      switch (contract.attributes.type) {
        case 'contract_metering_point_operator':
          return 'Metering Point Operator';
        case 'contract_localpool_processing':
          return 'LCP processing';
        default:
          return 'Unknown';
      }
    };

    return (
      <div className="row">
        <div className="col-12">
          <h5>Contracts</h5>
          <p>List all contracts for the loacalpool</p>
        </div>
        <div className="col-12 no-padding">
          <table className="table">
            <thead className="thead-default">
              <tr>
                <th>Type</th>
                <th>Since</th>
                <th>Contract #</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { contracts.map(contract =>
                  <tr key={ contract.id }>
                    <td>{ contractType(contract) }</td>
                    <td>{ contract.attributes.signingDate }</td>
                    <td>{ contract.attributes.contractNumber }</td>
                    <td>
                      <Link
                        to={ `/localpools/${groupId}/contracts/${contract.id}` }
                        className="btn btn-secondary btn-beige"
                        style={{ float: 'right', marginRight: '15px' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
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

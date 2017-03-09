import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Contracts from '../../../contracts';

export class ContractsList extends Component {
  static propTypes = {
    loadGroupContracts: React.PropTypes.func.isRequired,
    groupId: React.PropTypes.string.isRequired,
    operatorContract: React.PropTypes.object,
    processingContract: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { loadGroupContracts, groupId } = this.props;
    loadGroupContracts(groupId);
  }

  render() {
    const { operatorContract, processingContract, loading, groupId } = this.props;

    if (loading) return (<div>Loading...</div>);

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
              { operatorContract &&
                <tr>
                  <td>Metering Point Operator</td>
                  <td>{ operatorContract.attributes.signingDate }</td>
                  <td>{ operatorContract.attributes.contractNumber }</td>
                  <td>
                    <Link
                      to={ `/localpools/${groupId}/contracts/${operatorContract.id}` }
                      className="btn btn-secondary btn-beige"
                      style={{ float: 'right', marginRight: '15px' }}>
                      View
                    </Link>
                  </td>
                </tr>
              }
              { processingContract &&
                <tr>
                  <td>LCP Processing</td>
                  <td>{ processingContract.attributes.signingDate }</td>
                  <td>{ processingContract.attributes.contractNumber }</td>
                  <td>
                    <Link
                      to={ `/localpools/${groupId}/contracts/${processingContract.id}` }
                      className="btn btn-secondary btn-beige"
                      style={{ float: 'right', marginRight: '15px' }}>
                      View
                    </Link>
                  </td>
                </tr>
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
    operatorContract: state.contracts.operatorContract,
    processingContract: state.contracts.processingContract,
    loading: state.contracts.loadingOperatorContract || state.contracts.loadingProcessingContract,
  };
}

export default connect(mapStateToProps, { loadGroupContracts: Contracts.actions.loadGroupContracts })(ContractsList);

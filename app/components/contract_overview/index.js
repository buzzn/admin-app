import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import Contracts from '../../contracts';
import Groups from '../../groups';

import './style.scss';

export class ContractOverview extends Component {
  static propTypes = {
    contract: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired,
    loadContract: React.PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { loadContract, loadGroup, group, match: { params: { contractId, groupId } } } = this.props;
    loadContract(contractId);
    if (!group) loadGroup(groupId);
  }

  render() {
    const { contract, group, loading } = this.props;

    if (loading || !contract.id || !group) return (<div>Loading...</div>);

    const contractType = (contract) => {
      switch (contract.type) {
        case 'metering-point-operators':
          return 'Metering Point Operator';
        default:
          return 'Unknown';
      }
    };

    return (
      <div>
        <Helmet title="Contract" />
        <div className="overview-header">Contract</div>
        <div className="row contract-overview top-content">
          <div className="col-12">
            <div className="title">
              { contractType(contract) } - { contract.attributes.contractNumber }
            </div>
          </div>
          <div className="col-12 padding-top"><h5 className="label">Contract Data</h5></div>
          <div className="col-6 padding-bottom">
            <div className="row">
              <div className="col-3"><span className="label">Local pool:</span></div>
              <div className="col-9"><Link to={ `/localpools/${group.id}` }>{ group.attributes.name }</Link></div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">Contract #:</span></div>
              <div className="col-9">{ contract.attributes.contractNumber }</div>
            </div>
          </div>
          <div className="col-6 padding-bottom">
            <div className="row">
              <div className="col-3"><span className="label">Begin:</span></div>
              <div className="col-9">{ contract.attributes.beginDate }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">Contact:</span></div>
              <div className="col-9"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contract: state.contracts.contract,
    group: state.groups.group,
    loading: state.contracts.loadingContract || state.groups.loadingGroup,
  };
}

export default connect(mapStateToProps, {
  loadContract: Contracts.actions.loadContract,
  loadGroup: Groups.actions.loadGroup,
})(ContractOverview);

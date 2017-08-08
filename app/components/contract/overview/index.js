import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import Contracts from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';

import './style.scss';

export class ContractOverview extends Component {
  static propTypes = {
    contract: PropTypes.object.isRequired,
    group: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    loadContract: PropTypes.func.isRequired,
    loadGroup: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { loadContract, loadGroup, group, match: { params: { contractId, groupId } } } = this.props;
    loadContract({ contractId, groupId });
    if (!group.id) loadGroup(groupId);
  }

  render() {
    const { contract, group, loading } = this.props;

    if (contract.status === 404) return (<div>Contract not found</div>);

    if (loading || !contract.id || !group.id) return (<div>Loading...</div>);

    const contractType = (cont) => {
      switch (cont.type) {
        case 'contract_metering_point_operator':
          return 'Metering Point Operator';
        case 'contract_localpool_processing':
          return 'LCP processing';
        default:
          return 'Unknown';
      }
    };

    const contractShortName = (cont) => {
      switch (cont.type) {
        case 'contract_metering_point_operator':
          return `MPO ${cont.fullContractNumber}`;
        case 'contract_localpool_processing':
          return `LCPP ${cont.fullContractNumber}`;
        default:
          return `${cont.fullContractNumber}`;
      }
    };

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/contracts`, title: group.name },
      { id: contract.id, title: contractShortName(contract), type: 'contract' },
    ];

    return (
      <div>
        <Helmet title="Contract" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row contract-overview top-content">
          <div className="col-12">
            <div className="title bg-consumption-dark">
              { contractType(contract) } - { contract.fullContractNumber }
            </div>
          </div>
          <div className="col-12 padding-top"><h5 className="label">Contract Data</h5></div>
          <div className="col-6 padding-bottom">
            <div className="row">
              <div className="col-3"><span className="label">Local pool:</span></div>
              <div className="col-9"><Link to={ `/localpools/${group.id}` }>{ group.name }</Link></div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">Contract #:</span></div>
              <div className="col-9">{ contract.fullContractNumber }</div>
            </div>
          </div>
          <div className="col-6 padding-bottom">
            <div className="row">
              <div className="col-3"><span className="label">Begin:</span></div>
              <div className="col-9">{ contract.beginDate }</div>
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

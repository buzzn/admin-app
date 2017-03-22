import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Contracts from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';

import './style.scss';

export class ContractingPartyOverview extends Component {
  static propTypes = {
    contractingParty: React.PropTypes.object.isRequired,
    contract: React.PropTypes.object.isRequired,
    group: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
    loadContract: React.PropTypes.func.isRequired,
    loadGroup: React.PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { loadContract, loadGroup, group, contractingParty, match: { params: { contractId, groupId } } } = this.props;
    if (!contractingParty.id) loadContract(contractId);
    if (!group) loadGroup(groupId);
  }

  render() {
    const { contractingParty, loading, group, contract } = this.props;

    if (loading || !contractingParty.id || !group) return (<div>Loading...</div>);

    const customerType = type => (type === 'organizations' ? 'Organization' : 'Person');
    const { address } = contractingParty;

    const contractShortName = (contract) => {
      switch (contract.type) {
        case 'metering-point-operators':
          return `MPO ${contract.attributes.contractNumber}`;
        case 'localpool-processings':
          return `LCPP ${contract.attributes.contractNumber}`;
        default:
          return `${contract.attributes.contractNumber}`;
      }
    };

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/contracts`, title: group.attributes.name },
      { id: contract.id, link: `/localpools/${group.id}/contracts/${contract.id}`, title: contractShortName(contract) },
      { id: contractingParty.id, title: contractingParty.attributes.name },
    ];

    return (
      <div>
        <Helmet title="Contracting party" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row contracting-party-overview top-content">
          <div className="col-12">
            <div className="title">
              { contractingParty.attributes.name }
            </div>
          </div>
          <div className="col-12 padding-top"><h5 className="label">Contracting Party Data</h5></div>
          <div className="col-6 padding-bottom">
            <div className="row">
              <div className="col-3"><span className="label">Name:</span></div>
              <div className="col-9">{ contractingParty.attributes.name }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">Type:</span></div>
              <div className="col-9">{ customerType(contractingParty.type) }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">ID:</span></div>
              <div className="col-9"></div>
            </div>
          </div>
          <div className="col-6 padding-bottom">
            <div className="row">
              <div className="col-3"><span className="label">Street:</span></div>
              <div className="col-9">{ address.attributes && address.attributes.streetName }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">Postal Code:</span></div>
              <div className="col-9">{ address.attributes && address.attributes.zip }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">City:</span></div>
              <div className="col-9">{ address.attributes && address.attributes.city }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">Email:</span></div>
              <div className="col-9">{ contractingParty.attributes.email }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { match: { params: { partyType } } } = props;

  return {
    contract: state.contracts.contract,
    group: state.groups.group,
    contractingParty: state.contracts[partyType],
    loading: state.contracts.loadingContract,
  };
}

export default connect(mapStateToProps, {
  loadContract: Contracts.actions.loadContract,
  loadGroup: Groups.actions.loadGroup,
})(ContractingPartyOverview);

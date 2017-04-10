import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Contracts from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';

import './style.scss';

export class ContractingPartyOverview extends Component {
  static propTypes = {
    contractingParty: PropTypes.object.isRequired,
    contract: PropTypes.object.isRequired,
    group: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    loadContract: PropTypes.func.isRequired,
    loadGroup: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { loadContract, loadGroup, group, contractingParty, match: { params: { contractId, groupId } } } = this.props;
    if (!contractingParty.id) loadContract(contractId);
    if (!group.id) loadGroup(groupId);
  }

  render() {
    const { contractingParty, loading, group, contract } = this.props;

    if (contractingParty.status === 404) return (<div>Contracting party not found</div>);

    if (loading || !contractingParty.id || !group.id) return (<div>Loading...</div>);

    const cpType = type => (type === 'organization' ? 'Organization' : 'Person');
    const { address } = contractingParty;

    const contractShortName = (cont) => {
      switch (cont.attributes.type) {
        case 'contract_metering_point_operator':
          return `MPO ${cont.attributes.contractNumber}`;
        case 'contract_localpool_processing':
          return `LCPP ${cont.attributes.contractNumber}`;
        default:
          return `${cont.attributes.contractNumber}`;
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
              <div className="col-9">{ cpType(contractingParty.attributes.type) }</div>
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Contracts from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';

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
    if (!contractingParty.id) loadContract({ contractId, groupId });
    if (!group.id) loadGroup(groupId);
  }

  render() {
    const { contractingParty, loading, group, contract, match: { params: { partyType } } } = this.props;

    if (contractingParty.status === 404) return (<div>Contracting party not found</div>);

    if (loading || !contractingParty.id || !group.id) return (<div>Loading...</div>);

    const cpType = type => (type === 'organization' ? 'Organization' : 'Person');
    const { address } = contractingParty;

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
      { id: contract.id, link: `/localpools/${group.id}/contracts/${contract.id}/${partyType}`, title: contractShortName(contract), type: 'contract' },
      { id: contractingParty.id, title: contractingParty.name, type: 'contractring party' },
    ];

    return (
      <div>
        <Helmet title="Contracting party" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row contracting-party-overview top-content">
          <div className="col-12">
            <div className="title bg-consumption-mid">
              { contractingParty.name }
            </div>
          </div>
          <div className="col-12 padding-top"><h5 className="label">Contracting Party Data</h5></div>
          <div className="col-6 padding-bottom">
            <div className="row">
              <div className="col-3"><span className="label">Name:</span></div>
              <div className="col-9">{ contractingParty.name || `${contractingParty.firstName} ${contractingParty.lastName}` }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">Type:</span></div>
              <div className="col-9">{ cpType(contractingParty.type) }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">ID:</span></div>
              <div className="col-9"></div>
            </div>
          </div>
          <div className="col-6 padding-bottom">
            <div className="row">
              <div className="col-3"><span className="label">Street:</span></div>
              <div className="col-9">{ address && address.streetName }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">Postal Code:</span></div>
              <div className="col-9">{ address && address.zip }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">City:</span></div>
              <div className="col-9">{ address && address.city }</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">Email:</span></div>
              <div className="col-9">{ contractingParty.email }</div>
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Contracts from '../../contracts';

import './style.scss';

export class ContractingPartyOverview extends Component {
  static propTypes = {
    contractingParty: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired,
    loadContract: React.PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { loadContract, contractingParty, match: { params: { contractId } } } = this.props;
    if (!contractingParty.id) loadContract(contractId);
  }

  render() {
    const { contractingParty, loading } = this.props;

    if (loading || !contractingParty.id) return (<div>Loading...</div>);

    const customerType = type => (type === 'organizations' ? 'Organization' : 'Person');
    const { address } = contractingParty;

    return (
      <div>
        <Helmet title="Contracting party" />
        <div className="overview-header">Contracting Party</div>
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
    contractingParty: state.contracts[partyType],
    loading: state.contracts.loadingContract,
  };
}

export default connect(mapStateToProps, {
  loadContract: Contracts.actions.loadContract,
})(ContractingPartyOverview);

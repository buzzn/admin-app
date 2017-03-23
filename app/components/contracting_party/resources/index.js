import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Contracts from 'contracts';
import Bank from 'components/bank';

export class ContractingPartyResources extends Component {
  static propTypes = {
    contractingParty: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { contractingParty, loading, loadContract, match: { params: { contractId } } } = this.props;
    if (!loading && !contractingParty.id) loadContract(contractId);
  }

  render() {
    const { loading, contractingParty, match: { url } } = this.props;

    return (
      <div>
        <Route path={ `${url}/contact` } render={ () => <div>Contact</div> } />
        <Route path={ `${url}/bank` } render={ () => <Bank {...{ loading, bank: contractingParty.bankAccount }} /> } />
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

export default connect(mapStateToProps, { loadContract: Contracts.actions.loadContract })(ContractingPartyResources);

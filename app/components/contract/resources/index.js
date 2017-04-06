import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import ContractingParty from './contracting_party';
import Contracts from 'contracts';

export class ContractResources extends Component {
  static propTypes = {
    customer: React.PropTypes.object.isRequired,
    contractor: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { customer, contractor, loading, loadContract, match: { params: { contractId } } } = this.props;
    if (!loading && (!customer.id || !contractor.id)) loadContract(contractId);
  }

  render() {
    const { loading, customer, contractor, match: { url, isExact, params: { groupId, contractId } } } = this.props;

    if (isExact) return (<Redirect to={ `${url}/customer` }/>);

    return (
      <div>
        <Route path={ `${url}/customer` } render={ () => <ContractingParty {...{
          contractingParty: customer,
          loading,
          partyType: 'customer',
          groupId,
          contractId,
        }} /> } />
        <Route path={ `${url}/contractor` } render={ () => <ContractingParty {...{
          contractingParty: contractor,
          loading,
          partyType: 'contractor',
          groupId,
          contractId,
        }} /> } />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    customer: state.contracts.customer,
    contractor: state.contracts.contractor,
    loading: state.contracts.loadingContract,
  };
}

export default connect(mapStateToProps, { loadContract: Contracts.actions.loadContract })(ContractResources);

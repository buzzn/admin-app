import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import ContractingParty from './contracting_party';
import Contracts from 'contracts';
import Tariffs from './tariffs';
import Payments from './payments';

export class ContractResources extends Component {
  static propTypes = {
    customer: PropTypes.object.isRequired,
    contractor: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { customer, contractor, contract, loading, loadContract, match: { params: { contractId, groupId } } } = this.props;
    if (!loading && (!customer.id || !contractor.id || !contract.id)) loadContract({ contractId, groupId });
  }

  render() {
    const {
      loading,
      customer,
      contract,
      contractor,
      match: { url, isExact, params: { groupId, contractId } },
    } = this.props;

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
        <Route path={ `${url}/tariffs` } render={ ({ match: { url } }) => <Tariffs
          url={ url }
          loading={ loading }
          tariffs={ (contract.tariffs || {}).array || [] } /> } />
        <Route path={ `${url}/payments` } render={ () => <Payments
          loading={ loading } payments={ (contract.payments || {}).array || [] } /> } />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contract: state.contracts.contract,
    customer: state.contracts.customer,
    contractor: state.contracts.contractor,
    loading: state.contracts.loadingContract,
  };
}

export default connect(mapStateToProps, { loadContract: Contracts.actions.loadContract })(ContractResources);

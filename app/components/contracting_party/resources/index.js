import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Contracts from 'contracts';
import BankAccount from './bank_account';

export class ContractingPartyResources extends Component {
  static propTypes = {
    contractingParty: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { contractingParty, loading, loadContract, match: { params: { contractId, groupId } } } = this.props;
    if (!loading && !contractingParty.id) loadContract({ contractId, groupId });
  }

  render() {
    const { loading, updateBankAccount, bankAccount, match: { url, isExact } } = this.props;

    if (isExact) return (<Redirect to={ `${url}/contact` }/>);

    return (
      <div>
        <Route path={ `${url}/contact` } render={ () => <div>Contact</div> } />
        <Route
          path={ `${url}/bank` }
          render={ () => <BankAccount loading={ loading }
                               bankAccount={ bankAccount }
                               updateBankAccount={ updateBankAccount } /> } />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { match: { params: { partyType } } } = props;
  return {
    contractingParty: state.contracts[partyType],
    loading: state.contracts.loadingContract,
    bankAccount: state.contracts.contract[`${partyType}BankAccount`],
  };
}

export default connect(mapStateToProps, {
  loadContract: Contracts.actions.loadContract,
  updateBankAccount: Contracts.actions.updateBankAccount,
})(ContractingPartyResources);

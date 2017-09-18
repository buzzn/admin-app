import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import get from 'lodash/get';
import Contracts from 'contracts';
import BankAccount from './bank_account';
import Contact from './contact';

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
    const {
      loading,
      contractingParty,
      contact,
      contactAddress,
      updateBankAccount,
      bankAccount,
      match: { url, isExact, params: { groupId } }
    } = this.props;

    if (isExact) return (<Redirect to={ `${url}/contact` }/>);

    return (
      <div>
        <Route path={ `${url}/contact` } render={ () => <Contact {...{ contact, contactAddress }} /> } />
        <Route
          path={ `${url}/bank` }
          render={ () => <BankAccount loading={ loading }
                               bankAccount={ bankAccount }
                               updateBankAccount={ (params) => { updateBankAccount({ ...params, groupId, partyId: contractingParty.id, partyType: contractingParty.type }); }} /> } />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { match: { params: { partyType } } } = props;
  return {
    contractingParty: state.contracts[partyType],
    contact: get(state.contracts[partyType], 'contact') || {},
    contactAddress: get(state.contracts[partyType], 'contact.address') || {},
    loading: state.contracts.loadingContract,
    bankAccount: state.contracts.contract[`${partyType}BankAccount`],
  };
}

export default connect(mapStateToProps, {
  loadContract: Contracts.actions.loadContract,
  updateBankAccount: Contracts.actions.updateBankAccount,
})(ContractingPartyResources);

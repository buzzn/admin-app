import React from 'react';
import { connect } from 'react-redux';
import Bank from 'components/bank';

function mapStateToProps(state) {
  return {
    bank: state.contracts.contract.customerBankAccount,
    loading: state.contracts.loadingContract,
  };
}

export default connect(mapStateToProps)(Bank);

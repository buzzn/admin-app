import React from 'react';
import PropTypes from 'prop-types';
import Bank from 'components/bank';

const BankAccount = ({ loading, bankAccount, updateBankAccount }) => {
  if (!bankAccount || bankAccount.status === 404) return (<div>Bank account not found</div>);

  if (loading || !bankAccount.id) return (<div>Loading...</div>);

  return (
    <Bank loading={ loading }
          bank={ bankAccount }
          updateBankAccount={ updateBankAccount }
          initialValues={ bankAccount || {} } />
  );
};

BankAccount.propTypes = {
  loading: PropTypes.bool.isRequired,
  bankAccount: PropTypes.object,
  updateBankAccount: PropTypes.func.isRequired,
};

export default BankAccount;

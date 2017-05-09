import React from 'react';
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
  loading: React.PropTypes.bool.isRequired,
  bankAccount: React.PropTypes.object,
  updateBankAccount: React.PropTypes.func.isRequired,
};

export default BankAccount;

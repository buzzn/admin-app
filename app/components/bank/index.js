import React from 'react';

const Bank = ({ loading, bank }) => {
  if (loading) return (<div>Loading...</div>);

  if (!bank.id) return (<div></div>);

  return (
    <div className="row">
      <div className="col-6">
        <div className="row">
          <div className="col-6">Name:</div>
          <div className="col-6">{ bank.attributes.bankName }</div>
        </div>
        <div className="row">
          <div className="col-6">BIC:</div>
          <div className="col-6">{ bank.attributes.bic }</div>
        </div>
        <div className="row">
          <div className="col-6">IBAN:</div>
          <div className="col-6">{ bank.attributes.iban }</div>
        </div>
      </div>
    </div>
  );
};

Bank.propTypes = {
  bank: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired,
};

export default Bank;

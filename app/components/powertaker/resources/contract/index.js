import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Contract = ({ contract }) => {
  if (!contract.id) return false;

  const tariff = contract.tariffs.array.sort((a, b) => (new Date(b.beginDate)).valueOf() - (new Date(a.beginDate)).valueOf())[0] || {};

  return (
    <div className="row">
      <div className="col-12">
        <h5>Contract data</h5>
        <div className="row">
          <div className="col-6">Contract number</div>
          <div className="col-6">{contract.fullContractNumber}</div>
        </div>
        <div className="row">
          <div className="col-6">Register</div>
          <div className="col-6">{contract.register}</div>
        </div>
        <div className="row">
          <div className="col-6">Status</div>
          <div className="col-6">{contract.status}</div>
        </div>
        <div className="row">
          <div className="col-6">Begin date</div>
          <div className="col-6">{contract.beginDate}</div>
        </div>
        <div className="row">
          <div className="col-6">End date</div>
          <div className="col-6">{contract.endDate}</div>
        </div>
        <div className="row">
          <div className="col-6">Signed on</div>
          <div className="col-6">{contract.signingDate}</div>
        </div>
        <div className="row">
          <div className="col-6">Signed by</div>
          <div className="col-6">{contract.signingUser}</div>
        </div>
        <div className="row">
          <div className="col-6">Canceled on</div>
          <div className="col-6">{contract.cancelationDate}</div>
        </div>
        <h5>Billing basis</h5>
        <div className="row">
          <div className="col-6">Estimated consumption</div>
          <div className="col-6">{contract.forecastWattHourPa}</div>
        </div>
        <div className="row">
          <div className="col-6">EEG calculation</div>
          <div className="col-6">{contract.renewableEnergyLawTaxation}</div>
        </div>
        <div className="row">
          <div className="col-6">Pricing</div>
          <div className="col-6">{tariff.name}</div>
        </div>
        <div className="row">
          <div className="col-6">Invoice reference</div>
          <div className="col-6">{contract.thirdPartyBillingNumber}</div>
        </div>
        <div className="row">
          <div className="col-6">Tenant reference</div>
          <div className="col-6">{contract.thirdPartyRenterNumber}</div>
        </div>
        <div className="row">
          <div className="col-6">SEPA reference</div>
          <div className="col-6">{!!contract.customer && contract.customer.mandateReference}</div>
        </div>
        <h5>Supplier change</h5>
        <div className="row">
          <div className="col-6">Prior supplier</div>
          <div className="col-6">{contract.oldSupplierName}</div>
        </div>
        <div className="row">
          <div className="col-6">Prior customer number</div>
          <div className="col-6">{contract.oldCustomerNumber}</div>
        </div>
        <div className="row">
          <div className="col-6">Prior account number</div>
          <div className="col-6">{contract.oldAccountNumber}</div>
        </div>
      </div>
    </div>
  );
};

Contract.propTypes = {
  contract: PropTypes.object,
};

Contract.defaultProps = {
  contract: {},
};

function mapStateToProps(state) {
  return {
    contract: state.contracts.contract,
  };
}

export default connect(mapStateToProps)(Contract);

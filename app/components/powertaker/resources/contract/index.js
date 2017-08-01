import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

const Contract = ({ contract }) => {
  if (!contract.id) return false;

  const tariff = contract.tariffs.array.sort((a, b) => (new Date(b.beginDate)).valueOf() - (new Date(a.beginDate)).valueOf())[0] || {};

  const prefix = 'admin.contracts';

  return (
    <div className="row">
      <div className="col-12">
        <h5><FormattedMessage id={ `${prefix}.headerContractData` }/></h5>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.fullContractNumber` }/>:</div>
          <div className="col-6">{contract.fullContractNumber}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.register` }/>:</div>
          <div className="col-6">{contract.register}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.status` }/>:</div>
          <div className="col-6">{contract.status}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.beginDate` }/>:</div>
          <div className="col-6">{contract.beginDate}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.endDate` }/>:</div>
          <div className="col-6">{contract.endDate}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.signingDate` }/>:</div>
          <div className="col-6">{contract.signingDate}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.signingUser` }/>:</div>
          <div className="col-6">{contract.signingUser}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.cancelationDate` }/>:</div>
          <div className="col-6">{contract.cancelationDate}</div>
        </div>
        <h5><FormattedMessage id={ `${prefix}.headerBillingBasis` }/></h5>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.forecastWattHourPa` }/>:</div>
          <div className="col-6">{contract.forecastWattHourPa}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.renewableEnergyLawTaxation` }/>:</div>
          <div className="col-6">{contract.renewableEnergyLawTaxation}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id="admin.tariffs.name"/>:</div>
          <div className="col-6">{tariff.name}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.thirdPartyBillingNumber` }/>:</div>
          <div className="col-6">{contract.thirdPartyBillingNumber}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.thirdPartyRenterNumber` }/>:</div>
          <div className="col-6">{contract.thirdPartyRenterNumber}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id="admin.persons.mandateReference"/>:</div>
          <div className="col-6">{!!contract.customer && contract.customer.mandateReference}</div>
        </div>
        <h5><FormattedMessage id={ `${prefix}.headerSupplierChange` }/></h5>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.oldSupplierName` }/>:</div>
          <div className="col-6">{contract.oldSupplierName}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.oldCustomerNumber` }/>:</div>
          <div className="col-6">{contract.oldCustomerNumber}</div>
        </div>
        <div className="row">
          <div className="col-6"><FormattedMessage id={ `${prefix}.oldAccountNumber` }/>:</div>
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

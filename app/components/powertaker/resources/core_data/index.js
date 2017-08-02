import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';

export const CoreData = ({ customer, customerAddress, contact, contactAddress }) => {
  if (!customer) return false;

  return (
    <div className="row">
      {
        customer.type === 'person' ?
          <div className="col-12">
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.prefix"/>:</div>
              <div className="col-6">{customer.prefix}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.title"/>:</div>
              <div className="col-6">{customer.title}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.firstName"/>:</div>
              <div className="col-6">{customer.firstName}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.lastName"/>:</div>
              <div className="col-6">{customer.lastName}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.email"/>:</div>
              <div className="col-6">{customer.email}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.phone"/>:</div>
              <div className="col-6">{customer.phone}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.street"/>:</div>
              <div className="col-6">{customerAddress.street}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.zip"/>:</div>
              <div className="col-6">{customerAddress.zip}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.city"/>:</div>
              <div className="col-6">{customerAddress.city}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.country"/>:</div>
              <div className="col-6">{customerAddress.country}</div>
            </div>
          </div> :
          <div className="col-12">
            <h5><FormattedMessage id="admin.organizations.headerOrganization"/>:</h5>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.organizations.name"/>:</div>
              <div className="col-6">{customer.name}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.organizations.description"/>:</div>
              <div className="col-6">{customer.description}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.organizations.email"/>:</div>
              <div className="col-6">{customer.email}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.organizations.website"/>:</div>
              <div className="col-6">{customer.website}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.organizations.phone"/>:</div>
              <div className="col-6">{customer.phone}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.organizations.fax"/>:</div>
              <div className="col-6">{customer.fax}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.street"/>:</div>
              <div className="col-6">{customerAddress.street}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.zip"/>:</div>
              <div className="col-6">{customerAddress.zip}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.city"/>:</div>
              <div className="col-6">{customerAddress.city}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.state"/>:</div>
              <div className="col-6">{customerAddress.state}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.country"/>:</div>
              <div className="col-6">{customerAddress.country}</div>
            </div>
            <h5><FormattedMessage id="admin.persons.headerContact"/>:</h5>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.prefix"/>:</div>
              <div className="col-6">{contact.prefix}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.title"/>:</div>
              <div className="col-6">{contact.title}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.firstName"/>:</div>
              <div className="col-6">{contact.firstName}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.lastName"/>:</div>
              <div className="col-6">{contact.lastName}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.email"/>:</div>
              <div className="col-6">{contact.email}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.persons.phone"/>:</div>
              <div className="col-6">{contact.phone}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.street"/>:</div>
              <div className="col-6">{contactAddress.street}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.zip"/>:</div>
              <div className="col-6">{contactAddress.zip}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.city"/>:</div>
              <div className="col-6">{contactAddress.city}</div>
            </div>
            <div className="row">
              <div className="col-6"><FormattedMessage id="admin.addresses.country"/>:</div>
              <div className="col-6">{contactAddress.country}</div>
            </div>
          </div>
      }
    </div>
  );
};

CoreData.propTypes = {
  customer: PropTypes.object,
  customerAddress: PropTypes.object,
  contact: PropTypes.object,
  contactAddress: PropTypes.object,
};

CoreData.defaultProps = {
  customer: {},
  customerAddress: {},
  contact: {},
  contactAddress: {},
};

function mapStateToProps(state) {
  return {
    customer: state.contracts.contract.customer,
    customerAddress: get(state.contracts.contract.customer, 'address') || {},
    contact: get(state.contracts.contract.customer, 'contact') || {},
    contactAddress: get(state.contracts.contract.customer, 'contact.address') || {},
  };
}

export default connect(mapStateToProps)(CoreData);

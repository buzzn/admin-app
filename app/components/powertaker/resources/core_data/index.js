import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

export const CoreData = ({ customer, customerAddress, contact, contactAddress }) => {
  if (!customer) return false;

  return (
    <div className="row">
      {
        customer.type === 'person' ?
          <div className="col-12">
            <h5>Person:</h5>
            <div className="row">
              <div className="col-6">Prefix</div>
              <div className="col-6">{customer.prefix}</div>
            </div>
            <div className="row">
              <div className="col-6">Title</div>
              <div className="col-6">{customer.title}</div>
            </div>
            <div className="row">
              <div className="col-6">First name</div>
              <div className="col-6">{customer.firstName}</div>
            </div>
            <div className="row">
              <div className="col-6">Last name</div>
              <div className="col-6">{customer.lastName}</div>
            </div>
            <div className="row">
              <div className="col-6">email</div>
              <div className="col-6">{customer.email}</div>
            </div>
            <div className="row">
              <div className="col-6">Phone</div>
              <div className="col-6">{customer.phone}</div>
            </div>
            <div className="row">
              <div className="col-6">Street</div>
              <div className="col-6">{customerAddress.street}</div>
            </div>
            <div className="row">
              <div className="col-6">Postal code</div>
              <div className="col-6">{customerAddress.zip}</div>
            </div>
            <div className="row">
              <div className="col-6">City</div>
              <div className="col-6">{customerAddress.city}</div>
            </div>
            <div className="row">
              <div className="col-6">Country</div>
              <div className="col-6">{customerAddress.country}</div>
            </div>
          </div> :
          <div className="col-12">
            <h5>Organization:</h5>
            <div className="row">
              <div className="col-6">Name</div>
              <div className="col-6">{customer.name}</div>
            </div>
            <div className="row">
              <div className="col-6">Description</div>
              <div className="col-6">{customer.description}</div>
            </div>
            <div className="row">
              <div className="col-6">Email</div>
              <div className="col-6">{customer.email}</div>
            </div>
            <div className="row">
              <div className="col-6">Website</div>
              <div className="col-6">{customer.website}</div>
            </div>
            <div className="row">
              <div className="col-6">Phone</div>
              <div className="col-6">{customer.phone}</div>
            </div>
            <div className="row">
              <div className="col-6">Fax</div>
              <div className="col-6">{customer.fax}</div>
            </div>
            <div className="row">
              <div className="col-6">Street</div>
              <div className="col-6">{customerAddress.street}</div>
            </div>
            <div className="row">
              <div className="col-6">Zipcode</div>
              <div className="col-6">{customerAddress.zip}</div>
            </div>
            <div className="row">
              <div className="col-6">City</div>
              <div className="col-6">{customerAddress.city}</div>
            </div>
            <div className="row">
              <div className="col-6">State</div>
              <div className="col-6">{customerAddress.state}</div>
            </div>
            <div className="row">
              <div className="col-6">Country</div>
              <div className="col-6">{customerAddress.country}</div>
            </div>
            <h5>Contact person:</h5>
            <div className="row">
              <div className="col-6">Prefix</div>
              <div className="col-6">{contact.prefix}</div>
            </div>
            <div className="row">
              <div className="col-6">Title</div>
              <div className="col-6">{contact.title}</div>
            </div>
            <div className="row">
              <div className="col-6">First name</div>
              <div className="col-6">{contact.firstName}</div>
            </div>
            <div className="row">
              <div className="col-6">Last name</div>
              <div className="col-6">{contact.lastName}</div>
            </div>
            <div className="row">
              <div className="col-6">email</div>
              <div className="col-6">{contact.email}</div>
            </div>
            <div className="row">
              <div className="col-6">Phone</div>
              <div className="col-6">{contact.phone}</div>
            </div>
            <div className="row">
              <div className="col-6">Street</div>
              <div className="col-6">{contactAddress.street}</div>
            </div>
            <div className="row">
              <div className="col-6">Postal code</div>
              <div className="col-6">{contactAddress.zip}</div>
            </div>
            <div className="row">
              <div className="col-6">City</div>
              <div className="col-6">{contactAddress.city}</div>
            </div>
            <div className="row">
              <div className="col-6">Country</div>
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

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const Contact = ({ contact, contactAddress }) => (
  <div className="row">
    <div className="col-12">
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
  </div>
);

Contact.propTypes = {
  contact: PropTypes.object.isRequired,
  contactAddress: PropTypes.object.isRequired,
};

export default Contact;

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';

import DefaultPerson from 'images/default_person.jpg';

const PowertakerData = ({ powertaker }) => {
  const powertakerTitle =
    powertaker.type === 'person' ? `${powertaker.firstName} ${powertaker.lastName}` : powertaker.name;
  const powertakerAddress = powertaker.address || {};
  const contact = powertaker.contact || {};
  const contactAddress = get(powertaker, 'contract.address') || {};

  return (
    <div className="row">
      <div className="col-12">
        <img className="top-avatar" src={powertaker.image || DefaultPerson} />
        {powertakerTitle}
      </div>
      {powertaker.type === 'person' ? (
        <div className="col-12">
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.prefix" />:
            </div>
            <div className="col-6">{powertaker.prefix}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.title" />:
            </div>
            <div className="col-6">{powertaker.title}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.firstName" />:
            </div>
            <div className="col-6">{powertaker.firstName}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.lastName" />:
            </div>
            <div className="col-6">{powertaker.lastName}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.email" />:
            </div>
            <div className="col-6">{powertaker.email}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.phone" />:
            </div>
            <div className="col-6">{powertaker.phone}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.street" />:
            </div>
            <div className="col-6">{powertakerAddress.street}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.zip" />:
            </div>
            <div className="col-6">{powertakerAddress.zip}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.city" />:
            </div>
            <div className="col-6">{powertakerAddress.city}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.country" />:
            </div>
            <div className="col-6">{powertakerAddress.country}</div>
          </div>
        </div>
      ) : (
        <div className="col-12">
          <h5>
            <FormattedMessage id="admin.organizations.headerOrganization" />:
          </h5>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.organizations.name" />:
            </div>
            <div className="col-6">{powertaker.name}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.organizations.description" />:
            </div>
            <div className="col-6">{powertaker.description}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.organizations.email" />:
            </div>
            <div className="col-6">{powertaker.email}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.organizations.website" />:
            </div>
            <div className="col-6">{powertaker.website}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.organizations.phone" />:
            </div>
            <div className="col-6">{powertaker.phone}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.organizations.fax" />:
            </div>
            <div className="col-6">{powertaker.fax}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.street" />:
            </div>
            <div className="col-6">{powertakerAddress.street}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.zip" />:
            </div>
            <div className="col-6">{powertakerAddress.zip}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.city" />:
            </div>
            <div className="col-6">{powertakerAddress.city}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.state" />:
            </div>
            <div className="col-6">{powertakerAddress.state}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.country" />:
            </div>
            <div className="col-6">{powertakerAddress.country}</div>
          </div>
          <h5>
            <FormattedMessage id="admin.persons.headerContact" />:
          </h5>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.prefix" />:
            </div>
            <div className="col-6">{contact.prefix}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.title" />:
            </div>
            <div className="col-6">{contact.title}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.firstName" />:
            </div>
            <div className="col-6">{contact.firstName}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.lastName" />:
            </div>
            <div className="col-6">{contact.lastName}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.email" />:
            </div>
            <div className="col-6">{contact.email}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.persons.phone" />:
            </div>
            <div className="col-6">{contact.phone}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.street" />:
            </div>
            <div className="col-6">{contactAddress.street}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.zip" />:
            </div>
            <div className="col-6">{contactAddress.zip}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.city" />:
            </div>
            <div className="col-6">{contactAddress.city}</div>
          </div>
          <div className="row">
            <div className="col-6">
              <FormattedMessage id="admin.addresses.country" />:
            </div>
            <div className="col-6">{contactAddress.country}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowertakerData;

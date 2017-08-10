import React from 'react';
import { FormattedMessage } from 'react-intl';
import NavLink from 'components/nav_link';

export const ContractNavBar = ({ match: { url } }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills nav-justified">
        <NavLink to={ `${url}/contract` }><FormattedMessage id="admin.contracts.navPillContract"/></NavLink>
        <NavLink to={ `${url}/customer` }><FormattedMessage id="admin.contracts.navPillCustomer"/></NavLink>
        <NavLink to={ `${url}/contractor` }><FormattedMessage id="admin.contracts.navPillContractor"/></NavLink>
        <NavLink to={ `${url}/tariffs` }><FormattedMessage id="admin.contracts.navPillTariffs"/></NavLink>
        <NavLink to={ `${url}/payments` }><FormattedMessage id="admin.contracts.navPillPayments"/></NavLink>
      </ul>
    </div>
  </div>
);

export default ContractNavBar;

import React from 'react';
import { FormattedMessage } from 'react-intl';
import NavLink from 'components/nav_link';

export const MyProfileNavBar = ({ match: { url } }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills nav-justified">
        <NavLink to={ `${url}/contact-info` }><FormattedMessage id="admin.persons.navPillContactInfo"/></NavLink>
        <NavLink to={ `${url}/account` }><FormattedMessage id="admin.persons.navPillAccount"/></NavLink>
        <NavLink to={ `${url}/bank` }><FormattedMessage id="admin.persons.navPillBank"/></NavLink>
      </ul>
    </div>
  </div>
);

export default MyProfileNavBar;

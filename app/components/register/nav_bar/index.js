import React from 'react';
import { FormattedMessage } from 'react-intl';
import NavLink from 'components/nav_link';

export const RegisterNavBar = ({ match: { url } }) => {
  const prefix = 'admin.registers';

  return (
    <div className="row">
      <div className="col-12">
        <ul className="nav nav-pills nav-justified">
          <NavLink to={ `${url}/register-data` }><FormattedMessage id={ `${prefix}.navPillRegisterData` }/></NavLink>
          <NavLink to={ `${url}/readings` }><FormattedMessage id={ `${prefix}.navPillReadings` }/></NavLink>
          <NavLink to={ `${url}/formula` }><FormattedMessage id={ `${prefix}.navPillFormula` }/></NavLink>
        </ul>
      </div>
    </div>
  );
};

export default RegisterNavBar;

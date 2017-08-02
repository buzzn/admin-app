import React from 'react';
import NavLink from 'components/nav_link';

export const PowertakerNavBar = ({ match: { url } }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills nav-justified">
        <NavLink to={ `${url}/powertaker` }>Powertaker</NavLink>
        <NavLink to={ `${url}/contract` }>Contract</NavLink>
        <NavLink to={ `${url}/bank` }>Bank</NavLink>
      </ul>
    </div>
  </div>
);

export default PowertakerNavBar;

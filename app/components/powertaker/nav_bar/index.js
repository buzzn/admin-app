import React from 'react';
import NavLink from 'components/nav_link';

export const PowertakerNavBar = ({ match: { url } }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills nav-justified">
        <NavLink to={ `${url}/core-data` }>Core Data</NavLink>
        <NavLink to={ `${url}/contracts` }>Contracts</NavLink>
        <NavLink to={ `${url}/bank` }>Bank</NavLink>
        <NavLink to={ `${url}/register` }>Register</NavLink>
        <NavLink to={ `${url}/charts` }>Charts</NavLink>
      </ul>
    </div>
  </div>
);

export default PowertakerNavBar;

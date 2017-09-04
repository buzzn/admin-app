import React from 'react';
import NavLink from 'components/nav_link';

export const LocalpoolNavBar = ({ match: { url } }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills nav-justified">
        <NavLink to={ `${url}/powertakers` }>Powertakers</NavLink>
        <NavLink to={ `${url}/contracts` }>Contracts</NavLink>
        <NavLink to={ `${url}/tariffs` }>Tariffs</NavLink>
        <NavLink to={ `${url}/system` }>System</NavLink>
        <NavLink to={ `${url}/billing` }>Billing</NavLink>
        <NavLink to={ `${url}/charts` }>Charts</NavLink>
        <NavLink to={ `${url}/documents` }>Documents</NavLink>
      </ul>
    </div>
  </div>
);

export default LocalpoolNavBar;

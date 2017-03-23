import React from 'react';
import NavLink from 'components/nav_link';

export const MeterNavBar = ({ match: { url } }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills nav-justified">
        <NavLink to={ `${url}/meter-data` }>Meter data</NavLink>
        <NavLink to={ `${url}/registers` }>Registers</NavLink>
        <NavLink to={ `${url}/formula` }>Formula</NavLink>
      </ul>
    </div>
  </div>
);

export default MeterNavBar;

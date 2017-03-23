import React from 'react';
import NavLink from 'components/nav_link';

export const ContractNavBar = ({ match: { params: { groupId, contractId } } }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills nav-justified">
        <NavLink to={ `/localpools/${groupId}/contracts/${contractId}/customer` }>Customer</NavLink>
        <NavLink to={ `/localpools/${groupId}/contracts/${contractId}/contractor` }>Contractor</NavLink>
      </ul>
    </div>
  </div>
);

export default ContractNavBar;

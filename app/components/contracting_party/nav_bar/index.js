import React from 'react';
import NavLink from 'components/nav_link';

export const ContractingPartyNavBar = ({ match: { params: { groupId, contractId, partyType } } }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills nav-justified">
        <NavLink to={ `/localpools/${groupId}/contracts/${contractId}/${partyType}/show/contact` }>Contact</NavLink>
        <NavLink to={ `/localpools/${groupId}/contracts/${contractId}/${partyType}/show/bank` }>Bank</NavLink>
      </ul>
    </div>
  </div>
);

export default ContractingPartyNavBar;

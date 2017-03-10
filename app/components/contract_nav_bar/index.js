import React from 'react';
import { connect } from 'react-redux';
import NavLink from '../nav_link';

export const ContractNavBar = ({ groupId, contractId }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills nav-justified">
        <NavLink to={ `/localpools/${groupId}/contracts/${contractId}/customer` }>Customer</NavLink>
        <NavLink to={ `/localpools/${groupId}/contracts/${contractId}/contractor` }>Contractor</NavLink>
      </ul>
    </div>
  </div>
);

function mapStateToProps(state, props) {
  const { match: { params: { groupId, contractId } } } = props;
  return { groupId, contractId };
}

export default connect(mapStateToProps)(ContractNavBar);

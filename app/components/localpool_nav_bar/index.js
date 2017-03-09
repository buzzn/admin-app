import React from 'react';
import { connect } from 'react-redux';
import NavLink from '../nav_link';

export const LocalpoolNavBar = ({ groupId }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills nav-justified">
        <NavLink to={ `/localpools/${groupId}/powertakers` }>Powertakers</NavLink>
        <NavLink to={ `/localpools/${groupId}/contracts` }>Contracts</NavLink>
        <NavLink to={ `/localpools/${groupId}/bank` }>Bank</NavLink>
        <NavLink to={ `/localpools/${groupId}/tax` }>Tax</NavLink>
        <NavLink to={ `/localpools/${groupId}/system` }>System</NavLink>
        <NavLink to={ `/localpools/${groupId}/charts` }>Charts</NavLink>
      </ul>
    </div>
  </div>
);

function mapStateToProps(state, props) {
  const { match: { params: { groupId } } } = props;
  return { groupId };
}

export default connect(mapStateToProps)(LocalpoolNavBar);

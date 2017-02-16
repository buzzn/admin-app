import React from 'react';
import { connect } from 'react-redux';
import NavLink from '../nav_link';

export const GroupNavBar = ({ groupId }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills">
        <NavLink to={ `/groups/${groupId}/powertakers` }>Powertakers</NavLink>
        <NavLink to={ `/groups/${groupId}/contracts` }>Contracts</NavLink>
        <NavLink to={ `/groups/${groupId}/bank` }>Bank</NavLink>
        <NavLink to={ `/groups/${groupId}/tax` }>Tax</NavLink>
        <NavLink to={ `/groups/${groupId}/system` }>System</NavLink>
        <NavLink to={ `/groups/${groupId}/charts` }>Charts</NavLink>
      </ul>
    </div>
  </div>
);

function mapStateToProps(state, props) {
  const { match: { params: { groupId } } } = props;
  return { groupId };
}

export default connect(mapStateToProps)(GroupNavBar);

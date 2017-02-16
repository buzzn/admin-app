import React from 'react';
import { connect } from 'react-redux';
import NavLink from '../nav_link';

export const PowertakerNavBar = ({ groupId, userId }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills">
        <NavLink to={ `/groups/${groupId}/powertakers/${userId}/core-data` }>Core Data</NavLink>
        <NavLink to={ `/groups/${groupId}/powertakers/${userId}/contracts` }>Contracts</NavLink>
        <NavLink to={ `/groups/${groupId}/powertakers/${userId}/bank` }>Bank</NavLink>
        <NavLink to={ `/groups/${groupId}/powertakers/${userId}/register` }>Register</NavLink>
        <NavLink to={ `/groups/${groupId}/powertakers/${userId}/charts` }>Charts</NavLink>
      </ul>
    </div>
  </div>
);

function mapStateToProps(state, props) {
  const { match: { params: { groupId, userId } } } = props;
  return { groupId, userId };
}

export default connect(mapStateToProps)(PowertakerNavBar);

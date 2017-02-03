import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Auth from '@buzzn/module_auth';
import NavLink from '../nav_link';

export const GroupNavBar = ({ dispatch, groupId }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills">
        <NavLink to={ `/groups/${groupId}/powertakers` }>Powertakers</NavLink>
        <NavLink to={ `/groups/${groupId}/contracts` }>Contracts</NavLink>
        <NavLink to={ `/groups/${groupId}/bank` }>Bank</NavLink>
        <NavLink to={ `/groups/${groupId}/tax` }>Tax</NavLink>
        <NavLink to={ `/groups/${groupId}/system` }>System</NavLink>
        <NavLink to={ `/groups/${groupId}/charts` }>Charts</NavLink>
        <li className="nav-item">
          <Link
            to=""
            onClick={ () => dispatch(Auth.actions.signOut()) }
            className="nav-link"
            style={{ backgroundColor: '#f76c51' }}>Sign Out</Link>
        </li>
      </ul>
    </div>
  </div>
);

function mapStateToProps(state, props) {
  const { match: { params: { groupId } } } = props;
  return { groupId };
}

export default connect(mapStateToProps)(GroupNavBar);

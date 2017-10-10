import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, children, exact, icon }) => (
  <NavLink className="sidebar-item" to={ to } exact={ exact }>
    <div className={ `fa fa-lg fa-${icon} sidebar-icon` }/>
    <div className="sidebar-text">
      { children }
    </div>
  </NavLink>
);

export default SidebarItem;

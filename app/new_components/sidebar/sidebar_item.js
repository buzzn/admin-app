import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, children, exact }) => (
  <NavLink className="sidebar-item" to={ to } exact={ exact }>{ children }</NavLink>
);

export default SidebarItem;

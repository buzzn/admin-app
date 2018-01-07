import * as React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, children, exact, icon, devMode }) => {
  if (devMode === undefined || devMode) {
    return (
      <NavLink className="sidebar-item" to={to} exact={exact}>
        <SidebarItemContent {...{ children, icon }} />
      </NavLink>
    );
  }
  return (
      <div className="sidebar-item under-construction">
        <SidebarItemContent {...{ children, icon }} />
      </div>
  );
};

const SidebarItemContent = ({ children, icon }) => [
  <div key={1} className={`fa fa-lg fa-${icon} sidebar-icon`} />,
  <div key={2} className="sidebar-text">
    {children}
  </div>,
];

export default SidebarItem;

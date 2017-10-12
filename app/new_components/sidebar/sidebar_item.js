// @flow
import * as React from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
  to: string,
  children: React.Node,
  exact?: boolean,
  icon: string,
};

const SidebarItem = ({ to, children, exact, icon }: Props) => (
  <NavLink className="sidebar-item" to={ to } exact={ exact }>
    <div className={ `fa fa-lg fa-${icon} sidebar-icon` }/>
    <div className="sidebar-text">
      { children }
    </div>
  </NavLink>
);

export default SidebarItem;

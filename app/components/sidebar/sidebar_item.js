// @flow
import * as React from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
  to: string,
  children: React.Node,
  exact?: boolean,
  icon: string,
  devMode?: boolean,
};

const SidebarItem = ({ to, children, exact, icon, devMode }: Props) => {
  if (devMode === undefined || devMode) {
    return (
      <NavLink className="sidebar-item" to={ to } exact={ exact }>
        <SidebarItemContent {...{ children, icon }}/>
      </NavLink>
    );
  } else {
    return (
      <div className="sidebar-item under-construction">
        <SidebarItemContent {...{ children, icon }}/>
      </div>
    );
  }
}

type ContentProps = {
  children: React.Node,
  icon: string,
};

const SidebarItemContent = ({ children, icon }: ContentProps) => [
  <div key={ 1 } className={ `fa fa-lg fa-${icon} sidebar-icon` }/>,
  <div key={ 2 } className="sidebar-text">
    { children }
  </div>,
];

export default SidebarItem;

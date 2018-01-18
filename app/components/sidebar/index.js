import React from 'react';
import SidebarItem from './sidebar_item';

import './style.scss';

const Sidebar = ({ url, devMode }) => (
  <div className="sidebar">
    <SidebarItem to="/groups" exact={true} icon="th-large">
      My Groups
    </SidebarItem>
    <SidebarItem to={`${url}/analytics`} icon="bolt" devMode={devMode}>
      Analytics
    </SidebarItem>
    <SidebarItem to={`${url}/powertakers`} icon="users">
      Powertakers
    </SidebarItem>
    <SidebarItem to={`${url}/prices`} icon="eur" devMode={devMode}>
      Prices
    </SidebarItem>
    <SidebarItem to={`${url}/invoices`} icon="money" devMode={devMode}>
      Invoices
    </SidebarItem>
    <SidebarItem to={`${url}/contracts`} icon="file-text-o" devMode={devMode}>
      Contracts
    </SidebarItem>
    <SidebarItem to={`${url}/system`} icon="cogs">
      System
    </SidebarItem>
    <SidebarItem to={`${url}/documents`} icon="folder-open-o" devMode={devMode}>
      Documents
    </SidebarItem>
    <SidebarItem to={`${url}/bubbles`} icon="pie-chart" devMode={devMode}>
      Bubbles
    </SidebarItem>
    <SidebarItem to={`${url}/settings`} icon="tachometer">
      Settings
    </SidebarItem>
  </div>
);

export default Sidebar;

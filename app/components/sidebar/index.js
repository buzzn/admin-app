// @flow
import React from 'react';
import SidebarItem from './sidebar_item';

import './style.scss';

type Props = {
  groupId: string,
};

const Sidebar = ({ groupId }: Props) => (
  <div className="sidebar">
    <SidebarItem to="/localpools" exact={ true } icon="th-large">My Groups</SidebarItem>
    <SidebarItem to={ `/localpools/${groupId}/analytics` } icon="bolt">Analytics</SidebarItem>
    <SidebarItem to={ `/localpools/${groupId}/powertakers` } icon="users">Powertakers</SidebarItem>
    <SidebarItem to={ `/localpools/${groupId}/prices` } icon="eur">Prices</SidebarItem>
    <SidebarItem to={ `/localpools/${groupId}/invoices` } icon="money">Invoices</SidebarItem>
    <SidebarItem to={ `/localpools/${groupId}/contracts` } icon="file-text-o">Contracts</SidebarItem>
    <SidebarItem to={ `/localpools/${groupId}/system` } icon="cogs">System</SidebarItem>
    <SidebarItem to={ `/localpools/${groupId}/documents` } icon="folder-open-o">Documents</SidebarItem>
    <SidebarItem to={ `/localpools/${groupId}/bubbles` } icon="pie-chart">Bubbles</SidebarItem>
  </div>
);

export default Sidebar;

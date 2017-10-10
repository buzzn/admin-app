import React from 'react';
import { FormattedMessage } from 'react-intl';
import SidebarItem from './sidebar_item';

import './style.scss';

const Sidebar = () => (
  <div className="sidebar">
    <SidebarItem to="/localpools" exact={ true }><FormattedMessage id="admin.ui.sidebarMyGroups"/></SidebarItem>
    <SidebarItem to="/localpools/:groupId/analytics"><FormattedMessage id="admin.ui.sidebarAnalytics"/></SidebarItem>
    <SidebarItem to="/localpools/:groupId/powertakers"><FormattedMessage id="admin.ui.sidebarPowertakers"/></SidebarItem>
    <SidebarItem to="/localpools/:groupId/prices"><FormattedMessage id="admin.ui.sidebarPrices"/></SidebarItem>
    <SidebarItem to="/localpools/:groupId/invoices"><FormattedMessage id="admin.ui.sidebarInvoices"/></SidebarItem>
    <SidebarItem to="/localpools/:groupId/contracts"><FormattedMessage id="admin.ui.sidebarContracts"/></SidebarItem>
    <SidebarItem to="/localpools/:groupId/system"><FormattedMessage id="admin.ui.sidebarSystem"/></SidebarItem>
    <SidebarItem to="/localpools/:groupId/documents"><FormattedMessage id="admin.ui.sidebarDocuments"/></SidebarItem>
  </div>
);

export default Sidebar;

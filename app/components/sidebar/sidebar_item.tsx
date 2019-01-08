import * as React from 'react';
import { SidebarLink, SidebarText, SidebarIcon } from './style';

interface ItemProps {
  to: string;
  exact?: boolean;
  devMode?: boolean;
}

interface ContentProps {
  children: string | JSX.Element;
  icon: string;
}

const SidebarItem = ({ to, children, exact, icon, devMode, ...props }: ItemProps & ContentProps) => {
  if (devMode === undefined || devMode) {
    return (
      <SidebarLink to={to} exact={exact} {...props}>
        <SidebarItemContent {...{ children, icon }} />
      </SidebarLink>
    );
  }
  return null;
};

const SidebarItemContent = ({ children, icon }: ContentProps) => (
  <>
    <SidebarIcon className={icon.startsWith('fa') ? `fa fa-lg ${icon}`: `buzzn-icon ${icon}`} />
    <SidebarText>{children}</SidebarText>
  </>
);

export default SidebarItem;

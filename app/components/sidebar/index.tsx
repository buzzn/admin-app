import React from 'react';
import SidebarItem from './sidebar_item';
import { SidebarBlock, Dummy } from './style';

interface Props {
  url: string;
  devMode: boolean;
  multiGroups: boolean;
}

class Sidebar extends React.Component<Props> {
  private sideCol;

  constructor(props) {
    super(props);

    this.setSideColWidth = this.setSideColWidth.bind(this);
  }

  state = { sideColWidth: 0 };

  componentDidMount() {
    this.setSideColWidth();

    window.addEventListener('resize', this.setSideColWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setSideColWidth);
  }

  setSideColWidth() {
    this.setState({ sideColWidth: this.sideCol ? this.sideCol.offsetWidth : 0 });
  }

  render() {
    const { url, devMode, multiGroups } = this.props;

    return (
      <div
        className="pl-0 pr-0 col-1"
        ref={(col) => {
          this.sideCol = col;
        }}
      >
        <SidebarBlock style={{ width: `${this.state.sideColWidth}px` }}>
          <Dummy />
          {multiGroups && (
            <SidebarItem to="/groups" exact={true} icon="th-large">
              Groups
            </SidebarItem>
          )}
          <SidebarItem to={`${url}/dashboard`} icon="bolt" devMode={devMode}>
            Dashboard
          </SidebarItem>
          <SidebarItem to={`${url}/analytics`} icon="bolt" devMode={devMode}>
            Analytics
          </SidebarItem>
          <SidebarItem to={`${url}/powertakers`} icon="users">
            Powertakers
          </SidebarItem>
          <SidebarItem to={`${url}/tariffs`} icon="eur">
            Tariffs
          </SidebarItem>
          <SidebarItem to={`${url}/billing`} icon="money" devMode={devMode}>
            Billing
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
          <SidebarItem to={`${url}/settings`} icon="tachometer">
            Settings
          </SidebarItem>
          <SidebarItem to={`${url}/bubbles`} icon="pie-chart" devMode={devMode}>
            Bubbles
          </SidebarItem>
        </SidebarBlock>
      </div>
    );
  }
}

export default Sidebar;

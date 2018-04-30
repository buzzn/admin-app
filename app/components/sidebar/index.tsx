import React from 'react';
import { FormattedMessage } from 'react-intl';
import SidebarItem from './sidebar_item';
import { SidebarBlock, Dummy } from './style';

interface Props {
  url: string;
  devMode: boolean;
  multiGroups: boolean;
}

class Sidebar extends React.Component<Props> {
  private sideCol;

  state = { sideColWidth: 0 };

  componentDidMount() {
    this.setSideColWidth();

    window.addEventListener('resize', this.setSideColWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setSideColWidth);
  }

  setSideColWidth = () => {
    this.setState({ sideColWidth: this.sideCol ? this.sideCol.offsetWidth : 0 });
  }

  render() {
    const { url, devMode, multiGroups } = this.props;
    const prefix = 'admin.sidebar';

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
              <FormattedMessage id={`${prefix}.groups`} />
            </SidebarItem>
          )}
          <SidebarItem to={`${url}/analytics`} icon="line-chart" devMode={devMode}>
            <FormattedMessage id={`${prefix}.analytics`} />
          </SidebarItem>
          <SidebarItem to={`${url}/powertakers`} icon="users">
            <FormattedMessage id={`${prefix}.powertakers`} />
          </SidebarItem>
          <SidebarItem to={`${url}/tariffs`} icon="eur">
            <FormattedMessage id={`${prefix}.tariffs`} />
          </SidebarItem>
          <SidebarItem to={`${url}/billing`} icon="money">
            <FormattedMessage id={`${prefix}.billing`} />
          </SidebarItem>
          <SidebarItem to={`${url}/contracts`} icon="file-text-o" devMode={devMode}>
            <FormattedMessage id={`${prefix}.contracts`} />
          </SidebarItem>
          <SidebarItem to={`${url}/system`} icon="cogs">
            <FormattedMessage id={`${prefix}.system`} />
          </SidebarItem>
          <SidebarItem to={`${url}/documents`} icon="folder-open-o" devMode={devMode}>
            <FormattedMessage id={`${prefix}.documents`} />
          </SidebarItem>
          <SidebarItem to={`${url}/settings`} icon="tachometer">
            <FormattedMessage id={`${prefix}.settings`} />
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

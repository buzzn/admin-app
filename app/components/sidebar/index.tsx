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
  };

  render() {
    const { url, multiGroups } = this.props;
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
            <SidebarItem to="/groups" exact={true} icon="fa-th-large">
              <FormattedMessage id={`${prefix}.groups`} />
            </SidebarItem>
          )}
          <SidebarItem to={`${url}/powertakers`} icon="fa-users" data-cy="sidebar powertakers">
            <FormattedMessage id={`${prefix}.powertakers`} />
          </SidebarItem>
          <SidebarItem to={`${url}/billings-overview`} icon="fa-binoculars" data-cy="sidebar billings-overview">
            <FormattedMessage id={`${prefix}.billingsOverview`} />
          </SidebarItem>
          <SidebarItem to={`${url}/tariffs`} icon="fa-eur" data-cy="sidebar tariffs">
            <FormattedMessage id={`${prefix}.tariffs`} />
          </SidebarItem>
          <SidebarItem to={`${url}/billing`} icon="fa-money">
            <FormattedMessage id={`${prefix}.billing`} />
          </SidebarItem>
          <SidebarItem to={`${url}/market-locations`} icon="buzzn-meters" data-cy="sidebar system">
            <FormattedMessage id={`${prefix}.system`} />
          </SidebarItem>
          <SidebarItem to={`${url}/documents`} icon="fa-folder-open-o" data-cy="sidebar documents">
            <FormattedMessage id={`${prefix}.documents`} />
          </SidebarItem>
          <SidebarItem to={`${url}/settings`} icon="fa-cogs">
            <FormattedMessage id={`${prefix}.settings`} />
          </SidebarItem>
          <SidebarItem to={`${url}/devices`} icon="buzzn-devices" data-cy="sidebar devices">
            <FormattedMessage id={`${prefix}.devices`} />
          </SidebarItem>
        </SidebarBlock>
      </div>
    );
  }
}

export default Sidebar;

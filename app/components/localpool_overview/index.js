import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Bubbles from '@buzzn/module_bubbles';
import Groups from '../../groups';
import Users from '../../users';
import BubblesLayout from './bubbles_layout';

import './style.scss';

export class LocalpoolOverview extends Component {
  static propTypes = {
    group: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { loadGroup, loadGroupManagers, loadBubbles, match: { params: { groupId } } } = this.props;
    loadGroup(groupId);
    loadGroupManagers(groupId);
    loadBubbles(groupId);
  }

  componentWillReceiveProps(nextProps) {
    const { loadGroup, loadGroupManagers, loadBubbles, match: { params: { groupId } } } = this.props;
    const { match: { params: { groupId: newGroupId } } } = nextProps;
    if (groupId !== newGroupId) {
      loadGroup(newGroupId);
      loadGroupManagers(newGroupId);
      loadBubbles(newGroupId);
    }
  }

  render() {
    const { group, loading, managers, profiles, token } = this.props;

    if (loading) return (<div>Loading...</div>);

    if (!group) return (<div>404</div>);

    const managersProfiles = managers.map(manager => (profiles[manager.id] ?
      `${profiles[manager.id].firstName} ${profiles[manager.id].lastName}` :
      'Loading...'));

    return (
      <div>
        <Helmet title="Localpool" />
        <div className="overview-header">Localpool</div>
        <div className="row group-overview top-content">
          <div className="col-12"><div className="title">{ group.attributes.name }</div></div>
          <div className="col-6 left-col">
            <div className="row">
              <div className="col-12">Address here</div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">LSG:</span></div>
              <div className="col-9"></div>
            </div>
            <div className="row">
              <div className="col-3"><span className="label">Managers:</span></div>
              <div className="col-9">{ managersProfiles.join(', ') }</div>
            </div>
          </div>
          <div className="col-6 right-col"><Bubbles.container Layout={ BubblesLayout } token={ token } /></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    loading: state.groups.loadingGroup,
    managers: state.users.groupManagers,
    profiles: state.profiles.profiles,
    token: state.auth.token,
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadGroupManagers: Users.actions.loadGroupManagers,
  loadBubbles: Bubbles.actions.setGroup,
})(LocalpoolOverview);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Bubbles from '@buzzn/module_bubbles';
import Groups from 'groups';
import Users from 'users';
import BubblesLayout from './bubbles_layout';

import './style.scss';

export class LocalpoolOverview extends Component {
  static propTypes = {
    group: PropTypes.object,
    loading: PropTypes.bool.isRequired,
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

  componentWillUnmount() {
    this.props.stopBubbles();
  }

  render() {
    const { group, loading, managers } = this.props;

    if (group.status === 404) return (<div>Group not found</div>);

    if (loading || !group.id) return (<div>Loading...</div>);

    const managersProfiles = managers.map(manager => (`${manager.firstName} ${manager.lastName}`));

    return (
      <div>
        <Helmet title="Localpool" />
        <div className="overview-header">Localpool</div>
        <div className="row group-overview top-content">
          <div className="col-12"><div className="title bg-production-dark">{ group.name }</div></div>
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
          <div className="col-6 right-col"><Bubbles.container Layout={ BubblesLayout } /></div>
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
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadGroupManagers: Users.actions.loadGroupManagers,
  loadBubbles: Bubbles.actions.setGroupId,
  stopBubbles: Bubbles.actions.stopRequests,
})(LocalpoolOverview);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Groups from '../../groups';
import Users from '../../users';

import './style.scss';

export class GroupOverview extends Component {
  static propTypes = {
    group: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { loadGroup, loadGroupManagers, match: { params: { groupId } } } = this.props;
    loadGroup(groupId);
    loadGroupManagers(groupId);
  }

  render() {
    const { group, loading, managers, profiles } = this.props;

    if (loading) return (<div>Loading...</div>);

    if (!group) return (<div>404</div>);

    const managersProfiles = managers.map(manager => (profiles[manager.id] ?
      `${profiles[manager.id].firstName} ${profiles[manager.id].lastName}` :
      'Loading...'));

    return (
      <div className="row">
        <div className="col-12"><div className="title">{ group.attributes.name }</div></div>
        <div className="col-6">
          <div className="row">
            <div className="col-12">Address here</div>
          </div>
          <div className="row">
            <div className="col-3"><b>LSG:</b></div>
            <div className="col-9"></div>
          </div>
          <div className="row">
            <div className="col-3"><b>Managers:</b></div>
            <div className="col-9">{ managersProfiles.join(', ') }</div>
          </div>
        </div>
        <div className="col-6">Bubbles</div>
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
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadGroupManagers: Users.actions.loadGroupManagers,
})(GroupOverview);

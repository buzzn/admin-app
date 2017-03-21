import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Groups from '../../groups';
import Users from '../../users';
import Breadcrumbs from '../breadcrumbs';

import './style.scss';

export class PowertakerOverview extends Component {
  static propTypes = {
    profile: React.PropTypes.object,
    group: React.PropTypes.object,
    loadingGroup: React.PropTypes.bool.isRequired,
    loadGroup: React.PropTypes.func.isRequired,
    loadUser: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    profile: {},
  };

  componentWillMount() {
    const { loadingGroup, group, loadGroup, profile, loadUser, match: { params: { groupId, userId } } } = this.props;
    if (!loadingGroup && !group) loadGroup(groupId);
    if (!profile.loading && !profile.firstName) loadUser(userId);
  }

  render() {
    const {
      loadingGroup,
      group,
      profile: { firstName, lastName, mdImg, loading },
      match: { params: { userId } },
    } = this.props;

    if (loading || loadingGroup || !group) return (<div>Loading...</div>);

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/powertakers`, title: group.attributes.name },
      { id: userId, title: `${firstName} ${lastName}` },
    ];

    return (
      <div>
        <Helmet title="Powertaker" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row powertaker-overview top-content">
          <div className="col-12">
            <div className="title">
              { mdImg && <img className="top-avatar" src={ mdImg } /> }
              { `${firstName} ${lastName}` }
            </div>
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-12">Address here</div>
            </div>
            <div className="row">
              <div className="col-3"><b>Status:</b></div>
              <div className="col-9"></div>
            </div>
          </div>
          <div className="col-6">Bank</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { match: { params: { userId } } } = props;

  return {
    group: state.groups.group,
    loadingGroup: state.groups.loadingGroup,
    profile: state.profiles.profiles[userId],
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadUser: Users.actions.loadUser,
})(PowertakerOverview);

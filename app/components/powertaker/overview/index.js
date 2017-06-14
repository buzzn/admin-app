import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Groups from 'groups';
import Users from 'users';
import Breadcrumbs from 'components/breadcrumbs';

import './style.scss';

export class PowertakerOverview extends Component {
  static propTypes = {
    user: PropTypes.object,
    group: PropTypes.object,
    loadingGroup: PropTypes.bool.isRequired,
    loadGroup: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: {},
  };

  componentWillMount() {
    const { loadingGroup, group, loadGroup, user, loadUser, match: { params: { groupId, userId } } } = this.props;
    if (!loadingGroup && !group.id) loadGroup(groupId);
    if (user.id !== userId) loadUser({ userId, groupId });
  }

  render() {
    const {
      loadingGroup,
      loadingUser,
      group,
      user: { firstName, lastName, mdImg },
      match: { params: { userId } },
    } = this.props;

    if (loadingUser || loadingGroup || !group.id) return (<div>Loading...</div>);

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/powertakers`, title: group.name },
      { id: userId, title: `${firstName} ${lastName}` },
    ];

    return (
      <div>
        <Helmet title="Powertaker" />
        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
        <div className="row powertaker-overview top-content">
          <div className="col-12">
            <div className="title bg-wind-dark">
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

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    loadingGroup: state.groups.loadingGroup,
    user: state.users.user,
    loadingUser: state.users.loadingUser,
  };
}

export default connect(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  loadUser: Users.actions.loadUser,
})(PowertakerOverview);

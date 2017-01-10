import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import List from './list';

export class ListContainer extends Component {
  componentWillMount() {
    const { loadGroups, loadUserGroups, userId } = this.props;
    if (userId) {
      loadUserGroups(userId);
    } else {
      loadGroups();
    }
  }

  render() {
    const { groups, pathname, loading, pathPrefix } = this.props;

    return (
      <List groups={ groups } pathPrefix={ pathPrefix || pathname } loading={ loading } />
    );
  }
}

function mapStateToProps(state, props) {
  return {
    groups: props.userId ? state.groups.userGroups : state.groups.groups,
    loading: props.userId ? state.groups.loadingUserGroups : state.groups.loadingGroups,
  };
}

export default connect(mapStateToProps, {
  loadGroups: actions.loadGroups,
  loadUserGroups: actions.loadUserGroups,
})(ListContainer);

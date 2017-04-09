import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from '../actions';
import GroupsList from './list';

export class ListContainer extends Component {
  static propTypes = {
    loadGroups: PropTypes.func.isRequired,
    loadUserGroups: PropTypes.func.isRequired,
    userId: PropTypes.string,
    groups: PropTypes.array.isRequired,
    pathPrefix: PropTypes.string,
    pathname: PropTypes.string,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    groups: [],
  };

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
      <GroupsList groups={ groups } pathPrefix={ pathPrefix || pathname } loading={ loading } />
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

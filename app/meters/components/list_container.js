import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import List from './list';

export class ListContainer extends Component {
  componentWillMount() {
    const { loadMeters, loadUserMeters, userId } = this.props;
    if (userId) {
      loadUserMeters(userId);
    } else {
      loadMeters();
    }
  }

  render() {
    const { meters, pathname, loading, pathPrefix } = this.props;

    return (
      <List meters={ meters } pathPrefix={ pathPrefix || pathname } loading={ loading } />
    );
  }
}

function mapStateToProps(state, props) {
  return {
    meters: props.userId ? state.meters.userMeters : state.meters.meters,
    loading: props.userId ? state.meters.loadingUserMeters : state.meters.loadingMeters,
  };
}

export default connect(mapStateToProps, {
  loadMeters: actions.loadMeters,
  loadUserMeters: actions.loadUserMeters,
})(ListContainer);

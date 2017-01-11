import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import List from './list';

export class ListContainer extends Component {
  componentWillMount() {
    const { loadUserMeters, userId } = this.props;
    if (userId) {
      loadUserMeters(userId);
    } else {

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
  loadUserMeters: actions.loadUserMeters,
})(ListContainer);

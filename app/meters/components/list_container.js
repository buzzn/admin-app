import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import List from './list';

export class ListContainer extends Component {
  componentWillMount() {
    const { loadMeters } = this.props;
    loadMeters();
  }

  render() {
    const { meters, pathname, loading } = this.props;

    return (
      <List meters={ meters } pathPrefix={ pathname } loading={ loading } />
    );
  }
}

function mapStateToProps(state) {
  return {
    meters: state.meters.meters,
    loading: state.meters.loadingMeters,
  };
}

export default connect(mapStateToProps, { loadMeters: actions.loadMeters })(ListContainer);

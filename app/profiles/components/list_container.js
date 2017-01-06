import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import List from './list';

export class ListContainer extends Component {
  componentWillMount() {
    const { loadProfiles } = this.props;
    loadProfiles();
  }

  render() {
    const { profiles, pathname, loading } = this.props;

    return (
      <List profiles={ profiles } pathPrefix={ pathname } loading={ loading } />
    );
  }
}

function mapStateToProps(state) {
  return {
    profiles: state.profiles.profiles,
    loading: state.profiles.loadingProfiles,
  };
}

export default connect(mapStateToProps, { loadProfiles: actions.loadProfiles })(ListContainer);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';

export class Profile extends Component {
  componentWillMount() {
    const { loadProfile, params: { id } } = this.props;
    loadProfile(id);
  }

  render() {
    const { profile, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    if (!profile) return (<div>Profile not found</div>);

    return (
      <div className="profile">
        <h4>{ profile.attributes.name }</h4>
        <span>Readable: { profile.attributes.readable }</span>
        <p>{ profile.attributes.description }</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profiles.profile,
    loading: state.profiles.loadingProfile,
  };
}

export default connect(mapStateToProps, { loadProfile: actions.loadProfile })(Profile);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';

export class Profile extends Component {
  componentWillMount() {
    const { loadProfile, profile, userId } = this.props;
    if (!profile) loadProfile(userId);
  }

  render() {
    const { profile, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    if (!profile) return (<div>Profile not found</div>);

    return (
      <div className="profile">
        <h4>{ profile.firstName } { profile.lastName }</h4>
        <p>{ profile.aboutMe }</p>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userId: props.userId,
    profile: state.profiles.profiles[props.userId],
    loading: state.profiles.loadingProfile,
  };
}

export default connect(mapStateToProps, { loadProfile: actions.loadProfile })(Profile);

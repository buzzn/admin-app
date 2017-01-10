import React from 'react';
import { connect } from 'react-redux';

export const Profile = ({ profile }) => {
  if (!profile || profile.failed) return (<div>Profile not found</div>);

  if (profile.loading) return (<div>Loading...</div>);

  return (
    <div className="profile">
      <h4>{ profile.firstName } { profile.lastName }</h4>
      <p>{ profile.aboutMe }</p>
    </div>
  );
};

function mapStateToProps(state, props) {
  return {
    profile: state.profiles.profiles[props.userId],
  };
}

export default connect(mapStateToProps)(Profile);

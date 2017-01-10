import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

export const Profile = ({ profile, pathPrefix, userId }) => {
  if (!profile || profile.failed) return (<div>Profile not found</div>);

  if (profile.loading) return (<div>Loading...</div>);

  return (
    <div className="profile">
      <h4>{ profile.firstName } { profile.lastName }</h4>
      <p>{ profile.aboutMe }</p>
      <Link
        key={ profile.id }
        className="list-profile-item list-profile-item-action"
        to={ `${pathPrefix || ''}/profile/${userId}` }>
        { profile.firstName }
      </Link>
    </div>
  );
};

function mapStateToProps(state, props) {
  return {
    userId: props.userId,
    pathPrefix: props.pathPrefix,
    profile: state.profiles.profiles[props.userId],
  };
}

export default connect(mapStateToProps)(Profile);

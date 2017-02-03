import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import find from 'lodash/find';

export const List = ({ profiles, pathPrefix }) => (
  <div className="profiles">
    { profiles.map((profile) => {
      if (!profile.profile || profile.profile.failed) return (<div key={ profile.userId }>Profile not found</div>);

      if (profile.profile.loading) return (<div key={ profile.userId }>Loading...</div>);

      return (
      <div key={ profile.userId } className="profile">
        <Link
          className="list-profile-item list-profile-item-action"
          to={ `${pathPrefix || ''}/${profile.userId}` }>
          { profile.profile.firstName } { profile.profile.lastName }
        </Link>
        <p>{ profile.profile.aboutMe }</p>
      </div>
      );
    }) }
  </div>
);

function mapStateToProps(state, props) {
  const profiles = props.userIds.map(userId => ({
    userId,
    profile: find(state.profiles.profiles, (v, k) => k === userId),
  }));

  return {
    pathPrefix: props.pathPrefix,
    profiles,
  };
}

export default connect(mapStateToProps)(List);

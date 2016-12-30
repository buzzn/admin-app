import React from 'react';
import { Link } from 'react-router';

export default ({ friends }) => (
  <div>
    <h4>Friends:</h4>
    { friends.map(friend => (
      <div key={ friend.id }>
        <Link to={ `/profile/${friend.id}` }>{ friend.profile.firstName } { friend.profile.lastName }</Link>
      </div>
    )) }
  </div>
);

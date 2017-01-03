import React from 'react';
import { Link } from 'react-router';

export default ({ friends }) => (

  <div className="list-group">
    <h4>friends</h4>
    { friends.map(friend => (
        <Link key={ friend.id } className="list-group-item list-group-item-action" to={ `/profile/${friend.id}` }>
          { friend.profile.firstName } { friend.profile.lastName }
        </Link>
    )) }
  </div>

);

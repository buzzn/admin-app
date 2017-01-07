import React from 'react';
import { Link } from 'react-router';

export default ({ profiles, pathPrefix, loading }) => (
  <div className="list-profile">
    <h4>profiles</h4>
    { loading ?
      <div>Loading...</div> :
      <div>
        { profiles.map(profile => (
          <Link
            key={ profile.id }
            className="list-group-item list-group-item-action"
            to={ `${pathPrefix}/profile/${profile.id}` }>
            { profile.firstName } { profile.lastName }
          </Link>
          ))
        }
      </div>
    }
  </div>
);

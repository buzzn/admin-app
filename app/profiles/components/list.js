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
            className="list-profile-item list-profile-item-action"
            to={ `${pathPrefix}/profile/${profile.id}` }>
            { profile.attributes.name }
          </Link>
          ))
        }
      </div>
    }
  </div>
);

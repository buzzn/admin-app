import React from 'react';
import { Link } from 'react-router';

export default ({ groups, pathPrefix, loading }) => (
  <div className="list-group">
    <h4>groups</h4>
    { loading ?
      <div>Loading...</div> :
      <div>
        { groups.map(group => (
          <Link
            key={ group.id }
            className="list-group-item list-group-item-action"
            to={ `${pathPrefix}/group/${group.id}` }>
            { group.attributes.name }
          </Link>
          ))
        }
      </div>
    }
  </div>
);

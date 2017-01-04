import React from 'react';
import { Link } from 'react-router';

export default ({ groups, pathPrefix }) => (
  <div className="list-group">
    <h4>groups</h4>
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
);

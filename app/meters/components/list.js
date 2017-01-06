import React from 'react';
import { Link } from 'react-router';

export default ({ meters, pathPrefix, loading }) => (
  <div className="list-meter">
    <h4>meters</h4>
    { loading ?
      <div>Loading...</div> :
      <div>
        { meters.map(meter => (
          <Link
            key={ meter.id }
            className="list-group-item list-group-item-action"
            to={ `${pathPrefix}/meter/${meter.id}` }>
            { meter.attributes['first-name'] }
          </Link>
          ))
        }
      </div>
    }
  </div>
);

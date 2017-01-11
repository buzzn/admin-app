import React from 'react';
import { Link } from 'react-router';

export default ({ meters, pathPrefix, loading }) => (
  <div className="list-meter">
    { loading ?
      <div>Loading...</div> :
      <div>
        { meters.length > 0 &&
          <div>
            <h4>meters</h4>
            { meters.map(meter => (
              <Link
                key={ meter.id }
                className="list-group-item list-group-item-action"
                to={ `${pathPrefix}/${meter.id}` }>
                { meter.id }
              </Link>
              ))
            }
          </div>
        }
      </div>
    }
  </div>
);

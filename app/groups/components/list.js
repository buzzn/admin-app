import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const List = ({ groups, pathPrefix, loading }) => (
  <div className="list-group">
    { loading ?
      <div>Loading...</div> :
      <div>
        { groups.length > 0 &&
          <div>
            <h4>groups</h4>
            { groups.map(group => (
              <Link
                key={ group.id }
                className="list-group-item list-group-item-action"
                to={ `${pathPrefix}/${group.id}` }>
                { group.attributes.name }
              </Link>
              ))
            }
          </div>
        }
      </div>
    }
  </div>
);

List.propTypes = {
  groups: PropTypes.array.isRequired,
  pathPrefix: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

List.defaultProps = {
  groups: [],
};

export default List;

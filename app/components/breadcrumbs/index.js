import React from 'react';
import { Link } from 'react-router-dom';

import './style.scss';

// TODO: this can be replaced with fully connected standalone component after preloader will be implemented. #91
const Breadcrumbs = ({ breadcrumbs }) => (
  <div className="row">
    <div className="col-12 breadcrumbs">
      <ul>
        { breadcrumbs.map(crumb => (
          <li key={ crumb.id }>
            { crumb.link ?
              <span><Link to={ crumb.link }>{ crumb.title }</Link>&nbsp;/&nbsp;</span> :
              <span>{ crumb.title }</span>
            }
          </li>
        ))
        }
      </ul>
    </div>
  </div>
);

Breadcrumbs.propTypes = {
  breadcrumbs: React.PropTypes.array.isRequired,
};

Breadcrumbs.defaultProps = {
  breadcrumbs: [],
};
export default Breadcrumbs;

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import './style.scss';

// TODO: this can be replaced with fully connected standalone component after preloader will be implemented. #91
const Breadcrumbs = ({ breadcrumbs, intl }) => (
  <div className="row">
    <div className="col-12 breadcrumbs">
      <ul>
        { breadcrumbs.map(crumb => (
          <li key={ crumb.id }>
            { crumb.link ?
              <span>
                <Link to={ crumb.link }>
                  {
                    crumb.type ?
                      <span>
                        <span className="breadcrumb-type">{ intl.formatMessage({ id: `admin.types.${crumb.type}` }) }:</span> { crumb.title }
                      </span> :
                      crumb.title
                  }
                </Link>&nbsp;/&nbsp;
              </span> :
              <span>
                {
                  crumb.type ?
                    <span>
                      <span className="breadcrumb-type">{ intl.formatMessage({ id: `admin.types.${crumb.type}` }) }:</span> { crumb.title }
                    </span> :
                    crumb.title
                }
              </span>
            }
          </li>
        ))
        }
      </ul>
    </div>
  </div>
);

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.array.isRequired,
};

Breadcrumbs.defaultProps = {
  breadcrumbs: [],
};
export default injectIntl(Breadcrumbs);

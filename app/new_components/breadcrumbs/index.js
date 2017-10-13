// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import { Link } from 'react-router-dom';

import './style.scss';

type Props = {
  breadcrumbs: Array<{
    id: number | string,
    link?: string,
    type?: string,
    title: string,
  }>,
  intl: intlShape,
};

// TODO: this can be replaced with fully connected standalone component after preloader will be implemented. #91
const Breadcrumbs = ({ breadcrumbs, intl }: Props) => (
  <div className="breadcrumbs">
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
);

export default injectIntl(Breadcrumbs);

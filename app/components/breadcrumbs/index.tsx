import * as React from 'react';
import { injectIntl, InjectIntlProps } from 'react-intl';
import { Link } from 'react-router-dom';
import { BreadcrumbsWrap } from './style';

export interface BreadcrumbsProps {
  breadcrumbs: Array<{
    id: string | number;
    link?: string;
    type?: string;
    title: string;
  }>;
}

const Breadcrumbs = ({ breadcrumbs, intl }: BreadcrumbsProps & InjectIntlProps) => (
  <BreadcrumbsWrap>
    <ul>
      {breadcrumbs.map(crumb => (
        <li key={crumb.id}>
          {crumb.link ? (
            <span>
              <Link to={crumb.link}>
                {crumb.type ? (
                  <span>
                    <span className="breadcrumb-type">{intl.formatMessage({ id: `admin.types.${crumb.type}` })}:</span>{' '}
                    {crumb.title}
                  </span>
                ) : (
                  crumb.title
                )}
              </Link>&nbsp;/&nbsp;
            </span>
          ) : (
            <span>
              {crumb.type ? (
                <span>
                  <span className="breadcrumb-type">{intl.formatMessage({ id: `admin.types.${crumb.type}` })}:</span>{' '}
                  {crumb.title}
                </span>
              ) : (
                crumb.title
              )}
            </span>
          )}
        </li>
      ))}
    </ul>
  </BreadcrumbsWrap>
);

export default injectIntl(Breadcrumbs);

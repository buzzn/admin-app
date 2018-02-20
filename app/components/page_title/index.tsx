import * as React from 'react';
import { Col } from 'reactstrap';
import Breadcrumbs, { BreadcrumbsProps } from 'components/breadcrumbs';
import LinkBack, { LinkBackProps } from 'components/link_back';
import { CenterContentHeader } from './style';

const PageTitle = ({ breadcrumbs, url, title }: BreadcrumbsProps & LinkBackProps) => (
  <CenterContentHeader>
    <Col xs={7}>
      <Breadcrumbs {...{ breadcrumbs }} />
      <LinkBack {...{ url, title }} />
    </Col>
    <Col xs={5} />
  </CenterContentHeader>
);

export default PageTitle;

import * as React from 'react';
import { Col } from 'reactstrap';
import Breadcrumbs, { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContentHeader, Title } from './style';

interface Props {
  title: string;
  thin?: string;
}

const PageTitle = ({ breadcrumbs, title, thin }: Props & BreadcrumbsProps) => (
  <CenterContentHeader {...{ thin }}>
    <Col xs={12}>
      <Breadcrumbs {...{ breadcrumbs }} />
      <Title>{title}</Title>
    </Col>
  </CenterContentHeader>
);

export default PageTitle;

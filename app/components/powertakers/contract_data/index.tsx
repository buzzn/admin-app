import * as React from 'react';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent } from 'components/style';
import Contract from 'components/contract';

interface Props {
  title: string;
  groupId: string;
  contractId: string;
  url: string;
}

const ContractData = ({ breadcrumbs, title, groupId, contractId, url }: Props & BreadcrumbsProps) => (
  <React.Fragment>
    <PageTitle {...{ breadcrumbs, title }} />
    <CenterContent>
      <Contract {...{ groupId, contractId, url }} />
    </CenterContent>
  </React.Fragment>
);

export default ContractData;

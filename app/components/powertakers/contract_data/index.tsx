import * as React from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SubNav } from 'components/style';
import Contract from 'components/contract';
import BillingsList from '../billings_list';

interface Props {
  title: string;
  groupId: string;
  contractId: string;
  url: string;
  contractUrl: string;
}

const ContractData = ({ breadcrumbs, title, groupId, contractId, url, contractUrl }: Props & BreadcrumbsProps) => (
  <>
    <PageTitle {...{ breadcrumbs, title }} />
    <CenterContent>
      <SubNav>
        <NavLink to={`${contractUrl}`} exact className="nav-link">
          <FormattedMessage id="admin.contracts.navContract" />
        </NavLink>
        <NavLink to={`${contractUrl}/billings`} exact className="nav-link" data-cy="contract billings tab">
          <FormattedMessage id="admin.contracts.navBillings" />
        </NavLink>
      </SubNav>
      <Switch>
        <Route path={contractUrl} exact>
          <Contract {...{ groupId, contractId, url }} />
        </Route>
        <Route path={`${contractUrl}/billings`}>
          <BillingsList {...{ groupId, contractId, url }} />
        </Route>
      </Switch>
    </CenterContent>
  </>
);

export default ContractData;

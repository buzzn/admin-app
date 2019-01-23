import * as React from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SubNav } from 'components/style';
import Contract from 'components/contract';
import AddMeter from 'components/system/add_meter';
import BillingsList from '../billings_list';

interface Props {
  title: string;
  groupId: string;
  contractId: string;
  url: string;
  contractUrl: string;
}

const ContractData = ({ breadcrumbs, title, groupId, contractId, url, contractUrl }: Props & BreadcrumbsProps) => (
  <React.Fragment>
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
        <Route
          exact
          path={`${contractUrl}/billings`}
          render={({ history, match: { url: billingsUrl } }) => (
            <BillingsList {...{ groupId, contractId, url, history, billingsUrl }} />
          )}
        />
        <Route
          path={`${contractUrl}/billings/add-meter`}
          render={() => (
            <AddMeter
              {...{
                url: `${contractUrl}/billings`,
                groupId,
              }}
            />
          )}
        />
      </Switch>
    </CenterContent>
  </React.Fragment>
);

export default ContractData;

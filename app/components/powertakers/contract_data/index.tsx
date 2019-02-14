import * as React from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SubNav } from 'components/style';
import Contract from 'components/contract';
import AddMeter from 'components/system/add_meter';
import BillingsList from '../billings_list';
import Payments from '../payments';

interface Props {
  title: string;
  groupId: string;
  contractId: string;
  contractType: string;
  url: string;
  contractUrl: string;
}

const ContractData = ({
  breadcrumbs,
  title,
  groupId,
  contractId,
  contractType,
  url,
  contractUrl,
}: Props & BreadcrumbsProps) => (
  <React.Fragment>
    <PageTitle {...{ breadcrumbs, title }} />
    <CenterContent>
      {contractType !== 'contract_localpool_third_party' && (
        <SubNav>
          <NavLink to={`${contractUrl}`} exact className="nav-link" data-cy="contract data tab">
            <FormattedMessage id="admin.contracts.navContract" />
          </NavLink>
          <NavLink to={`${contractUrl}/billings`} exact className="nav-link" data-cy="contract billings tab">
            <FormattedMessage id="admin.contracts.navBillings" />
          </NavLink>
          <NavLink to={`${contractUrl}/payments`} exact className="nav-link" data-cy="contract payments tab">
            <FormattedMessage id="admin.contracts.navPayments" />
          </NavLink>
        </SubNav>
      )}
      <Switch>
        <Route path={contractUrl} exact>
          <Contract {...{ groupId, contractId, url }} />
        </Route>
        {contractType !== 'contract_localpool_third_party' && (
          <React.Fragment>
            <Route
              exact
              path={`${contractUrl}/payments`}
              render={() => <Payments {...{ groupId, contractId, url }} />}
            />
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
          </React.Fragment>
        )}
      </Switch>
    </CenterContent>
  </React.Fragment>
);

export default ContractData;

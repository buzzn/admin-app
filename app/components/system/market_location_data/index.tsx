import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import get from 'lodash/get';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SubNav } from 'components/style';
import Contracts from './contracts';
import Registers from './registers';

interface Props {
  marketLocation: any;
  url: string;
  locationUrl: string;
}

const MarketLocationData = ({ breadcrumbs, url, locationUrl, marketLocation }: Props & BreadcrumbsProps) => (
  <React.Fragment>
    <PageTitle
      {...{
        breadcrumbs: breadcrumbs.concat([
          {
            id: marketLocation.id,
            type: 'marketLocation',
            title: marketLocation.name,
            link: undefined,
          },
        ]),
        url,
        title: marketLocation.name,
      }}
    />
    <CenterContent>
      <SubNav>
        <NavLink to={`${locationUrl}/contracts`} exact className="nav-link">
          !! Translate contracts
        </NavLink>
        <NavLink to={`${locationUrl}/registers`} exact className="nav-link">
          !! Translate registers
        </NavLink>
      </SubNav>
      <Switch>
        <Route
          path={`${locationUrl}/contracts`}
          render={({ history }) => (
            <Contracts
              {...{
                url,
                history,
                locationId: marketLocation.id,
                contracts: get(marketLocation.contracts, 'array', []),
              }}
            />
          )}
        />
        <Route
          path={`${locationUrl}/registers`}
          render={({ history }) => (
            <Registers {...{ url, history, locationId: marketLocation.id, registers: [marketLocation.register] }} />
          )}
        />

        <Route path={locationUrl}>
          <Redirect to={`${locationUrl}/contracts`} />
        </Route>
      </Switch>
    </CenterContent>
  </React.Fragment>
);

export default MarketLocationData;

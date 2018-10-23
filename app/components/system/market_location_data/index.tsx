import * as React from 'react';
import { FormattedMessage, injectIntl, InjectIntlProps } from 'react-intl';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import get from 'lodash/get';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SubNav } from 'components/style';
import Contracts from './contracts';
import Registers from './registers';
import RegisterPowerContainer from '../register_data/register_power';
import { MarketLocationId } from './style';

interface Props {
  marketLocation: any;
  url: string;
  locationUrl: string;
  groupId: string;
}

const MarketLocationData = ({
  breadcrumbs,
  url,
  locationUrl,
  groupId,
  marketLocation,
  intl,
}: Props & BreadcrumbsProps & InjectIntlProps) => (
  <React.Fragment>
    <PageTitle
      {...{
        breadcrumbs: breadcrumbs.concat([
          {
            id: marketLocation.id,
            type: 'marketLocation',
            title: intl.formatMessage({ id: `admin.marketLocations.${marketLocation.kind}` }),
            link: undefined,
          },
        ]),
        title: marketLocation.name,
      }}
    />
    <CenterContent>
      <RegisterPowerContainer
        {...{ groupId, meterId: marketLocation.register.meterId, registerId: marketLocation.register.id }}
      />
      <MarketLocationId>
        <FormattedMessage id="admin.marketLocations.thirdPartyId" />:{' '}
        <span className="value">{marketLocation.marketLocationId || '-----'}</span>
      </MarketLocationId>
      <SubNav>
        <NavLink to={`${locationUrl}/contracts`} exact className="nav-link">
          <FormattedMessage id="admin.marketLocations.navContracts" />
        </NavLink>
        <NavLink to={`${locationUrl}/registers`} exact className="nav-link">
          <FormattedMessage id="admin.marketLocations.navRegisters" />
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

export default injectIntl(MarketLocationData);

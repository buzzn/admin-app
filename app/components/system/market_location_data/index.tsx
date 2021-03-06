import * as React from 'react';
import { FormattedMessage, injectIntl, InjectIntlProps } from 'react-intl';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import get from 'lodash/get';
import PageTitle from 'components/page_title';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent, SubNav } from 'components/style';
import Contracts from './contracts';
import Registers from './registers';
import MarketLocationForm from './form';
import RegisterPowerContainer from '../register_data/register_power';
import { HeaderData, HeaderValue } from './style';

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
  updateMaLoValidationRules,
  updateRegisterMeta,
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
      <HeaderData>
        {!!marketLocation.registers.array
          && marketLocation.registers.array.map(r => (
            <RegisterPowerContainer {...{ groupId, meterId: r.meterId, registerId: r.id, key: r.id }} />
          ))}
        <HeaderValue>
          <FormattedMessage id="admin.marketLocations.thirdPartyId" />:{' '}
          <span className="value">{marketLocation.marketLocationId || '-----'}</span>
        </HeaderValue>
        <HeaderValue>
          <FormattedMessage id="admin.marketLocations.kind" />: <span className="value">{marketLocation.kind}</span>
        </HeaderValue>
      </HeaderData>
      {!!marketLocation.registers.array && (
        <SubNav>
          <NavLink to={`${locationUrl}/contracts`} exact className="nav-link">
            <FormattedMessage id="admin.marketLocations.navContracts" />
          </NavLink>
          <NavLink to={`${locationUrl}/registers`} exact className="nav-link" data-cy="malo registers tab">
            <FormattedMessage id="admin.marketLocations.navRegisters" />
          </NavLink>
        </SubNav>
      )}
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
        {!!marketLocation.registers.array && (
          <Route
            path={`${locationUrl}/registers`}
            render={({ history }) => (
              <Registers
                {...{ url, history, locationId: marketLocation.id, registers: marketLocation.registers.array }}
              />
            )}
          />
        )}

        <Route path={locationUrl}>
          <Redirect to={`${locationUrl}/contracts`} />
        </Route>
      </Switch>
      <MarketLocationForm
        {...{
          marketLocation,
          initialValues: marketLocation,
          groupId,
          updateRegisterMeta,
          validationRules: updateMaLoValidationRules,
        }}
      />
    </CenterContent>
  </React.Fragment>
);

export default injectIntl(MarketLocationData);

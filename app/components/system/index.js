import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import find from 'lodash/find';
import Groups from 'groups';
import MarketLocations from 'market_locations';
import Loading from 'components/loading';
import Breadcrumbs from 'components/breadcrumbs';
import LinkBack from 'components/link_back';
import MarketLocationsList from './market_locations_list';
import RegisterDataForm from './register_data';
import ReadingsList from './readings_list';
import RegisterPowerContainer from './register_power';
import MeterDataForm from './meter_data';
import RegisterContracts from './register_contracts';

export class System extends React.Component {
  componentWillMount() {
    const { loadMarketLocations, loadGroup, match: { params: { groupId } } } = this.props;
    loadGroup(groupId);
    loadMarketLocations(groupId);
  }

  componentWillUnmount() {
    this.props.setGroupMeters({ _status: null, array: [] });
  }

  render() {
    const {
      devMode,
      loading,
      marketLocations,
      setMarketLocations,
      group,
      realValidationRules,
      virtualValidationRules,
      match: { url, params: { groupId } },
    } = this.props;

    if (marketLocations._status === 404 || marketLocations._status === 403) {
      setMarketLocations({ _status: null, array: [] });
      return <Redirect to="/groups" />;
    }

    if (marketLocations._status === null || loading) return <Loading minHeight={40} />;

    const breadcrumbs = [
      { id: 0, link: '/groups', title: 'My groups' },
      { id: group.id || 1, link: url, title: group.name },
    ];

    return (
      <React.Fragment>
        {/* Breadcrumbs */}
        <div className="row center-content-header">
          <div className="col-7">
            <Switch>
              { /* <Route
                path={`${url}/:meterId`}
                render={({ match: { url: meterUrl, params: { meterId } } }) => {
                  const meter = find(meters.array, m => m.id === meterId);
                  if (!meter) return <Redirect to={url} />;
                  return (
                    <Switch>
                      <Route
                        path={`${meterUrl}/registers/:registerId`}
                        render={({ match: { params: { registerId } } }) => {
                          const register = find(meter.registers.array, r => r.id === registerId);
                          if (!register) return <Redirect to={meterUrl} />;
                          breadcrumbs.push({
                            id: register.id,
                            type: 'register',
                            title: register.name,
                            link: undefined,
                          });
                          return (
                            <React.Fragment>
                              <Breadcrumbs breadcrumbs={breadcrumbs} />
                              <LinkBack url={url} title={register.name} />
                            </React.Fragment>
                          );
                        }}
                      />
                      <Route
                        path={meterUrl}
                        render={() => {
                          breadcrumbs.push({
                            id: meter.id,
                            type: 'meter',
                            title: meter.productSerialnumber,
                            link: undefined,
                          });
                          return (
                            <React.Fragment>
                              <Breadcrumbs breadcrumbs={breadcrumbs} />
                              <LinkBack url={url} title={`Meter ${meter.productSerialnumber}`} />
                            </React.Fragment>
                          );
                        }}
                      />
                    </Switch>
                  );
                }}
              /> */ }
              <Route
                path={url}
                render={() => (
                  <React.Fragment>
                    <Breadcrumbs breadcrumbs={breadcrumbs.concat([{ id: '-----', title: 'System setup' }])} />
                    <LinkBack title="System setup" />
                  </React.Fragment>
                )}
              />
            </Switch>
          </div>
          <div className="col-5" />
        </div>
        {/* End of Breadcrumbs */}

        <div className="center-content">
          {/* Root sub nav */}
          <Route
            path={url}
            exact
            render={() => (
              <Nav className="sub-nav">
                <NavLink to={url} exact className="nav-link">
                  Registers
                </NavLink>
                <NavLink to="#" disabled className="nav-link">
                  To be announced
                </NavLink>
              </Nav>
            )}
          />
          {/* End of root sub nav */}

          <Switch>
            {/* Detailed UI */}
            <Route
              path={`${url}/:meterId`}
              render={({ match: { url: meterUrl, params: { meterId } } }) => {
                const meter = find(meters.array, m => m.id === meterId);
                if (!meter) return <Redirect to={url} />;
                return (
                  <React.Fragment>
                    {/* Main UI */}
                    <Switch>
                      <Route
                        path={`${meterUrl}/registers/:registerId`}
                        render={({ history, match: { url: registerUrl, params: { registerId } } }) => {
                          const register = find(meter.registers.array, r => r.id === registerId);
                          if (!register) return <Redirect to={meterUrl} />;
                          return (
                            <React.Fragment>
                              <RegisterPowerContainer {...{ groupId, meterId, registerId: register.id }} />

                              {/* Sub nav */}
                              <Nav className="sub-nav">
                                <NavLink to={`${registerUrl}/readings`} exact className="nav-link">
                                  Readings
                                </NavLink>
                                <NavLink to={`${registerUrl}/contracts`} exact className="nav-link">
                                  Contracts
                                </NavLink>
                                <NavLink to={`${registerUrl}/devices`} exact className="nav-link">
                                  Devices
                                </NavLink>
                                <NavLink to={registerUrl} exact className="nav-link">
                                  Details
                                </NavLink>
                              </Nav>
                              {/* End of Sub nav */}

                              <Switch>
                                <Route path={`${registerUrl}/readings`}>
                                  {register.readings && (
                                    <ReadingsList
                                      {...{
                                        readings: register.readings.array,
                                        registerId: register.id,
                                      }}
                                    />
                                  )}
                                </Route>
                                <Route path={`${registerUrl}/contracts`}>
                                  {register.contracts && (
                                    <RegisterContracts
                                      {...{
                                        contracts: register.contracts.array,
                                        url,
                                        history,
                                        registerId: register.id,
                                      }}
                                    />
                                  )}
                                </Route>
                                <Route path={`${registerUrl}/devices`}>
                                  <div className={devMode ? '' : 'under-construction'} style={{ height: '8rem' }} />
                                </Route>
                                <Route path={registerUrl} exact>
                                  <RegisterDataForm {...{ register, meter }} />
                                </Route>
                              </Switch>
                            </React.Fragment>
                          );
                        }}
                      />
                      <Route
                        path={meterUrl}
                        render={() => (
                          <MeterDataForm
                            {...{ meter, realValidationRules, virtualValidationRules, initialValues: meter }}
                          />
                        )}
                      />
                    </Switch>
                    {/* End of Main UI */}
                  </React.Fragment>
                );
              }}
            />
            {/* End of Detailed UI */}

            {/* Root list */}
            <Route
              path={url}
              render={({ history }) => (
                <MarketLocationsList
                  {...{
                    marketLocations: marketLocations.array,
                    url,
                    history,
                    groupId,
                  }}
                />
              )}
            />
            {/* End of Root list */}
          </Switch>
        </div>

        {/* Modals */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    devMode: state.app.ui.devMode,
    group: state.groups.group,
    loading: state.marketLocations.loadingMarketLocations || !state.groups.group.id,
    marketLocations: state.marketLocations.marketLocations,
    realValidationRules: state.meters.realValidationRules,
    virtualValidationRules: state.meters.virtualValidationRules,
  };
}

export default connect(mapStateToProps, {
  loadMarketLocations: MarketLocations.actions.loadMarketLocations,
  setMarketLocations: MarketLocations.actions.setMarketLocations,
  loadGroup: Groups.actions.loadGroup,
})(System);

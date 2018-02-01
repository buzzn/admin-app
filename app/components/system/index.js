import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import Meters from 'meters';
import Groups from 'groups';
import Loading from 'components/loading';
import Breadcrumbs from 'components/breadcrumbs';
import LinkBack from 'components/link_back';
import RegistersList from './registers_list';
import RegisterDataForm from './register_data';
import ReadingsList from './readings_list';
import RegisterPowerContainer from './register_power';
import MeterDataForm from './meter_data';
import RegisterContracts from './register_contracts';

export class System extends React.Component {
  componentWillMount() {
    const { loadGroupMeters, loadGroup, match: { params: { groupId } } } = this.props;
    loadGroup(groupId);
    loadGroupMeters(groupId);
  }

  render() {
    const {
      devMode,
      loading,
      meters,
      setGroupMeters,
      registers,
      group,
      realValidationRules,
      virtualValidationRules,
      match: { url, params: { groupId } },
    } = this.props;

    if (meters._status === 404 || meters._status === 403) {
      setGroupMeters({ _status: null, array: [] });
      return <Redirect to="/groups" />;
    }

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
              <Route
                path={`${url}/:meterId`}
                render={({ match: { url: meterUrl, params: { meterId } } }) => {
                  if (loading) return <Loading minHeight={4} />;
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
              />
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
                if (loading) return <Loading minHeight={40} />;
                const meter = find(meters.array, m => m.id === meterId);
                if (!meter) return <Redirect to={url} />;
                return (
                  <React.Fragment>
                    {/* Main UI */}
                    <Switch>
                      <Route
                        path={`${meterUrl}/registers/:registerId`}
                        render={({ match: { url: registerUrl, params: { registerId } } }) => {
                          const register = find(meter.registers.array, r => r.id === registerId);
                          if (!register) return <Redirect to={url} />;
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
                                  {register.readings && <ReadingsList readings={register.readings.array} />}
                                </Route>
                                <Route path={`${registerUrl}/contracts`}>
                                  {register.contracts && <RegisterContracts contracts={register.contracts.array} />}
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
              render={({ history }) => <RegistersList registers={registers} url={url} history={history} />}
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
  const registers =
    state.meters.groupMeters._status === 200
      ? compact(flatten(state.meters.groupMeters.array.map((m) => {
        if (!m.registers) return [];
        return m.registers.array.map(r => ({
          ...r,
          meterId: m.id,
          meterProductSerialnumber: m.productSerialnumber,
        }));
      })))
      : [];

  return {
    devMode: state.app.ui.devMode,
    group: state.groups.group,
    loading: state.meters.loadingGroupMeters || !state.groups.group.id,
    meters: state.meters.groupMeters,
    registers,
    realValidationRules: state.meters.realValidationRules,
    virtualValidationRules: state.meters.virtualValidationRules,
  };
}

export default connect(mapStateToProps, {
  loadGroupMeters: Meters.actions.loadGroupMeters,
  setGroupMeters: Meters.actions.setGroupMeters,
  loadGroup: Groups.actions.loadGroup,
})(System);

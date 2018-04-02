import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';
import get from 'lodash/get';
import Meters from 'meters';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import Loading from 'components/loading';
import { CenterContent, SubNav } from 'components/style';
import PageTitle from 'components/page_title';
import RegisterPowerContainer from './register_power';
import RegisterDataForm from './form';
import ReadingsList from './readings_list';
import RegisterContracts from './register_contracts';

class RegisterData extends React.Component<ExtProps & DispatchProps & StateProps & BreadcrumbsProps> {
  componentDidMount() {
    const { loadMeter, groupId, meterId } = this.props;
    loadMeter({ groupId, meterId });
  }

  componentWillUnmount() {
    this.props.setMeter({ _status: null });
  }

  render() {
    const { url, registerUrl, breadcrumbs, loading, meter, groupId, meterId, registerId, devMode } = this.props;

    if (loading || meter._status === null) return <Loading minHeight={40} />;
    if (meter._status && meter._status !== 200) return <Redirect to={url} />;

    const register = get(meter, 'registers.array', []).find(r => r.id === registerId);
    if (!register) return <Redirect to={url} />;

    const contracts = get(register.marketLocation, 'contracts.array', []);

    return (
      <React.Fragment>
        <PageTitle
          {...{
            breadcrumbs: breadcrumbs.concat([
              {
                id: register.id,
                type: 'register',
                title: register.marketLocation.name,
                link: undefined,
              },
            ]),
            title: register.marketLocation.name,
          }}
        />
        <CenterContent>
          <RegisterPowerContainer {...{ groupId, meterId, registerId }} />
          <SubNav>
            <NavLink to={`${registerUrl}/readings`} exact className="nav-link">
              <FormattedMessage id="admin.registers.navReadings" />
            </NavLink>
            <NavLink to={`${registerUrl}/contracts`} exact className="nav-link">
              <FormattedMessage id="admin.registers.navContracts" />
            </NavLink>
            <NavLink to={`${registerUrl}/devices`} exact className="nav-link">
              <FormattedMessage id="admin.registers.navDevices" />
            </NavLink>
            <NavLink to={registerUrl} exact className="nav-link">
              <FormattedMessage id="admin.registers.navDetails" />
            </NavLink>
          </SubNav>
          <Switch>
            <Switch>
              <Route path={`${registerUrl}/readings`}>
                {register.readings && (
                  <ReadingsList
                    {...{
                      readings: register.readings.array,
                      registerId,
                    }}
                  />
                )}
              </Route>
              <Route
                path={`${registerUrl}/contracts`}
                render={({ history }) => (
                  <React.Fragment>
                    {' '}
                    {!!contracts.length && (
                      <RegisterContracts
                        {...{
                          contracts,
                          url,
                          history,
                          registerId,
                        }}
                      />
                    )}
                  </React.Fragment>
                )}
              />
              <Route path={`${registerUrl}/devices`}>
                <div className={devMode ? '' : 'under-construction'} style={{ height: '8rem' }} />
              </Route>
              <Route path={registerUrl} exact>
                <RegisterDataForm {...{ register, meter, url }} />
              </Route>
            </Switch>
          </Switch>
        </CenterContent>
      </React.Fragment>
    );
  }
}

interface StatePart {
  meters: { loadingMeter: boolean; meter: { _status: null | number; [key: string]: any } };
}

interface ExtProps {
  url: string;
  registerUrl: string;
  groupId: string;
  meterId: string;
  registerId: string;
  devMode: boolean;
}

interface StateProps {
  loading: boolean;
  meter: { _status: null | number; [key: string]: any };
}

interface DispatchProps {
  loadMeter: Function;
  setMeter: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    meter: state.meters.meter,
    loading: state.meters.loadingMeter,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {
  loadMeter: Meters.actions.loadMeter,
  setMeter: Meters.actions.setMeter,
})(RegisterData);

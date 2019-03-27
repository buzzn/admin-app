import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';
import get from 'lodash/get';
import Meters from 'meters';
import Registers from 'registers';
import Readings from 'readings';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import Loading from 'components/loading';
import { CenterContent, SubNav } from 'components/style';
import PageTitle from 'components/page_title';
import AddReading from 'components/add_reading';
import RegisterPowerContainer from './register_power';
import RegisterDataForm from './form';
import ReadingsList from './readings_list';

class RegisterData extends React.Component<ExtProps & DispatchProps & StateProps & BreadcrumbsProps> {
  state = { isOpen: false };

  switchAddReading = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  deleteReading = (readingId) => {
    const { deleteReading, groupId, meterId, registerId } = this.props;
    if (!confirm('Delete?')) return;
    deleteReading({ groupId, meterId, registerId, readingId });
  };

  componentDidMount() {
    const { loadMeter, groupId, meterId } = this.props;
    loadMeter({ groupId, meterId });
  }

  componentWillUnmount() {
    this.props.setMeter({ _status: null });
  }

  render() {
    const {
      url,
      registerUrl,
      breadcrumbs,
      loading,
      meter,
      groupId,
      meterId,
      registerId,
      devMode,
      updateRegister,
      validationRules,
    } = this.props;

    if (loading || meter._status === null) return <Loading minHeight={40} />;
    if (meter._status && meter._status !== 200) return <Redirect to={url} />;

    const register = get(meter, 'registers.array', []).find(r => r.id === registerId);
    if (!register) return <Redirect to={url} />;

    return (
      <React.Fragment>
        <PageTitle
          {...{
            breadcrumbs: breadcrumbs.concat([
              {
                id: register.id,
                type: 'register',
                title: register.registerMeta.name,
                link: undefined,
              },
            ]),
            title: register.registerMeta.name,
          }}
        />
        <CenterContent>
          <RegisterPowerContainer {...{ groupId, meterId, registerId }} />
          <SubNav>
            <NavLink to={`${registerUrl}/readings`} exact className="nav-link" data-cy="register readings tab">
              <FormattedMessage id="admin.registers.navReadings" />
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
                      meterId,
                      groupId,
                      deleteReading: this.deleteReading,
                      switchAddReading: this.switchAddReading,
                    }}
                  />
                )}
              </Route>
              <Route path={`${registerUrl}/devices`}>
                <div className={devMode ? '' : 'under-construction'} style={{ height: '8rem' }} />
              </Route>
              <Route path={registerUrl} exact>
                <RegisterDataForm
                  {...{
                    // FIXME: refactor this ASAP
                    register,
                    initialValues: register.registerMeta,
                    meter,
                    url,
                    groupId,
                    updateRegister,
                    validationRules,
                  }}
                />
              </Route>
            </Switch>
          </Switch>
          <AddReading
            {...{
              edifactMeasurementMethod: meter.edifactMeasurementMethod,
              isOpen: this.state.isOpen,
              switchAddReading: this.switchAddReading,
              groupId,
              meterId,
              registerId,
              cb: this.switchAddReading,
            }}
          />
        </CenterContent>
      </React.Fragment>
    );
  }
}

interface StatePart {
  meters: { loadingMeter: boolean; meter: { _status: null | number; [key: string]: any } };
  registers: { validationRules: any };
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
  validationRules: any;
}

interface DispatchProps {
  loadMeter: Function;
  setMeter: Function;
  updateRegister: Function;
  deleteReading: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    meter: state.meters.meter,
    loading: state.meters.loadingMeter,
    validationRules: state.registers.validationRules,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    loadMeter: Meters.actions.loadMeter,
    setMeter: Meters.actions.setMeter,
    updateRegister: Registers.actions.updateRegister,
    deleteReading: Readings.actions.deleteReading,
  },
)(RegisterData);

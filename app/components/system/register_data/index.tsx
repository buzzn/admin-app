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
import RegisterPowerContainer from './register_power';
import RegisterDataForm from './form';
import ReadingsList from './readings_list';
import AddReading from '../add_reading';

class RegisterData extends React.Component<ExtProps & DispatchProps & StateProps & BreadcrumbsProps> {
  state = { isOpen: false };

  switchAddReading = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  addReading = (params) => {
    const { addReading, groupId, meterId, registerId } = this.props;

    return new Promise((resolve, reject) => {
      addReading({ groupId, meterId, registerId, params, resolve, reject });
    }).then((res) => {
      this.switchAddReading();
      return res;
    });
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
      addReading,
      devMode,
      updateRegister,
      validationRules,
      readingsValidationRules,
    } = this.props;
    const { isOpen } = this.state;

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
                      addReading,
                      readingsValidationRules,
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
          <AddReading {...{ toggle: this.switchAddReading, isOpen, validationRules: readingsValidationRules, onSubmit: this.addReading }} />
        </CenterContent>
      </React.Fragment>
    );
  }
}

interface StatePart {
  meters: { loadingMeter: boolean; meter: { _status: null | number; [key: string]: any } };
  registers: { validationRules: any };
  readings: { validationRules: any };
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
  readingsValidationRules: any;
}

interface DispatchProps {
  loadMeter: Function;
  setMeter: Function;
  updateRegister: Function;
  addReading: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    meter: state.meters.meter,
    loading: state.meters.loadingMeter,
    validationRules: state.registers.validationRules,
    readingsValidationRules: state.readings.validationRules,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    loadMeter: Meters.actions.loadMeter,
    setMeter: Meters.actions.setMeter,
    updateRegister: Registers.actions.updateRegister,
    addReading: Readings.actions.addReading,
  },
)(RegisterData);

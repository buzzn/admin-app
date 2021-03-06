import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import Alert from 'react-s-alert';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import Groups from 'groups';
import DevicesModule from 'devices';
import Loading from 'components/loading';
import DevicesList from './devices_list';
import AddDevice from './add_device';
import Device from './device_data';

class Devices extends React.Component<
  ExtProps & StateProps & DispatchProps & InjectedIntlProps & RouteComponentProps<{}>,
  ComponentState
  > {
  state = { addDeviceOpen: false };

  switchAddDevice = () => {
    this.setState({ addDeviceOpen: !this.state.addDeviceOpen });
  };

  addDevice = (params) => {
    const {
      addDevice,
      match: { params: { groupId } },
    } = this.props;

    return new Promise((resolve, reject) => {
      addDevice({ resolve, reject, params, groupId });
    }).then(() => {
      Alert.success('Saved!');
      this.switchAddDevice();
    });
  };

  componentDidMount() {
    const {
      loadDevices,
      loadGroup,
      match: { params: { groupId } },
    } = this.props;
    loadDevices(groupId);
    loadGroup(groupId);
  }

  componentWillUnmount() {
    this.props.setDevices({ _status: null, array: [] });
  }

  render() {
    const {
      createValidationRules,
      updateValidationRules,
      setDevices,
      devices,
      group,
      loading,
      updateDevice,
      history,
      match: {
        url,
        params: { groupId },
      },
    } = this.props;

    if (devices._status === 404 || devices._status === 403) {
      setDevices({ _status: null, array: [] });
      return <Redirect to="/groups" />;
    }

    if (devices._status === null || loading) return <Loading minHeight={40} />;

    const breadcrumbs = [
      { id: 0, link: '/groups', title: 'My groups' },
      { id: group.id || 1, link: url, title: group.name },
    ];

    return (
      <React.Fragment>
        <Switch>
          <Route exact path={url}>
            <DevicesList
              {...{ switchAddDevice: this.switchAddDevice, devices: devices.array, groupId, breadcrumbs, url, history }}
            />
          </Route>
          <Route
            path={`${url}/:deviceId`}
            render={({ match: { params: { deviceId } } }) => {
              const device = devices.array.find(d => d.id === deviceId);
              if (!device) return <Redirect to={url} />;
              return (
                <Device
                  {...{
                    breadcrumbs,
                    device,
                    initialValues: device,
                    groupId,
                    validationRules: updateValidationRules,
                    updateDevice,
                  }}
                />
              );
            }}
          />
        </Switch>
        <AddDevice
          {...{
            isOpen: this.state.addDeviceOpen,
            toggle: this.switchAddDevice,
            onSubmit: this.addDevice,
            validationRules: createValidationRules,
          }}
        />
      </React.Fragment>
    );
  }
}

interface ExtProps {}

interface ComponentState {
  addDeviceOpen: boolean;
}

interface StatePart {
  devices: {
    loadingDevices: boolean;
    devices: { _status: null | number; array: Array<{ [key: string]: any }> };
    validationRules: { create: any; update: any };
  };
  groups: { group: { _status: null | number; [key: string]: any }; loadingGroup: boolean };
}

interface StateProps {
  createValidationRules: any;
  updateValidationRules: any;
  group: { _status: null | number; [key: string]: any };
  devices: { _status: null | number; array: Array<{ [key: string]: any }> };
  loading: boolean;
}

interface DispatchProps {
  loadGroup: Function;
  loadDevices: Function;
  setDevices: Function;
  addDevice: Function;
  updateDevice: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    createValidationRules: state.devices.validationRules.create,
    updateValidationRules: state.devices.validationRules.update,
    group: state.groups.group,
    devices: state.devices.devices,
    loading: state.devices.loadingDevices || state.groups.loadingGroup,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    loadGroup: Groups.actions.loadGroup,
    loadDevices: DevicesModule.actions.loadDevices,
    setDevices: DevicesModule.actions.setDevices,
    addDevice: DevicesModule.actions.addDevice,
    updateDevice: DevicesModule.actions.updateDevice,
  },
)(injectIntl(Devices));

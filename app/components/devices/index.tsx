import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import Alert from 'react-s-alert';
import { injectIntl,
  // FormattedMessage,
  InjectedIntlProps } from 'react-intl';
import Groups from 'groups';
import Organizations from 'organizations';
import DevicesModule from 'devices';
import Loading from 'components/loading';
import DevicesList from './devices_list';
import AddDevice from './add_device';

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
      group,
      match: { params: { groupId } },
    } = this.props;
    loadDevices(groupId);
    if (groupId !== group.id) loadGroup(groupId);
  }

  componentWillUnmount() {
    this.props.setDevices({ _status: null, array: [] });
  }

  render() {
    const {
      createValidationRules,
      // updateValidationRules,
      setDevices,
      devices,
      group,
      loading,
      loadAvailableOrganizationMarkets,
      organizationMarkets,
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
          <Route path={url}>
            <DevicesList {...{ switchAddDevice: this.switchAddDevice, devices: devices.array, groupId, breadcrumbs }} />
          </Route>
        </Switch>
        <AddDevice
          {...{
            isOpen: this.state.addDeviceOpen,
            toggle: this.switchAddDevice,
            onSubmit: this.addDevice,
            validationRules: createValidationRules,
            loadAvailableOrganizationMarkets,
            organizationMarkets,
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
  organizations: { availableOrganizationMarkets: { _status: null | number; array: Array<{ [key: string]: any }> } };
}

interface StateProps {
  createValidationRules: any;
  updateValidationRules: any;
  group: { _status: null | number; [key: string]: any };
  organizationMarkets: Array<{ [key: string]: any }>;
  devices: { _status: null | number; array: Array<{ [key: string]: any }> };
  loading: boolean;
}

interface DispatchProps {
  loadGroup: Function;
  loadDevices: Function;
  setDevices: Function;
  addDevice: Function;
  loadAvailableOrganizationMarkets: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    createValidationRules: state.devices.validationRules.create,
    updateValidationRules: state.devices.validationRules.update,
    group: state.groups.group,
    devices: state.devices.devices,
    loading: state.devices.loadingDevices || state.groups.loadingGroup,
    organizationMarkets: state.organizations.availableOrganizationMarkets.array,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(
  mapStateToProps,
  {
    loadGroup: Groups.actions.loadGroup,
    loadDevices: DevicesModule.actions.loadDevices,
    setDevices: DevicesModule.actions.setDevices,
    addDevice: DevicesModule.actions.addDevice,
    loadAvailableOrganizationMarkets: Organizations.actions.loadAvailableOrganizationMarkets,
  },
)(injectIntl(Devices));

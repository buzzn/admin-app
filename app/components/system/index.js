// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link, NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import find from 'lodash/find';
import map from 'lodash/map';
import Meters from 'meters';
import Registers from 'registers';
import Groups from 'groups';
import Readings from 'readings';
import Breadcrumbs from 'components/breadcrumbs';
import LinkBack from 'components/link_back';
import MetersList from './meters_list';
import MeterDataForm from './meter_data';
import RegistersList from './registers_list';
import RegisterDataForm from './register_data';
import ReadingsList from './readings_list/index';
import Formulas from './formulas';
import AddReading from './add_reading';

type Props = {
  loading: boolean,
  meters: { _status: null | number, array?: Array<Object> },
  registers: { _status: null | number, array?: Array<Object> },
  group: Object,
  // TODO: replace with action
  loadGroupMeters: Function,
  setGroupMeters: Function,
  loadGroup: Function,
  loadRegisters: Function,
  updateMeter: Function,
  updateRegister: Function,
  updateFormula: Function,
  addReading: Function,
  deleteReading: Function,
  realValidationRules: Object,
  virtualValidationRules: Object,
  registerValidationRules: Object,
  readingsValidationRules: Object,
  match: { url: string, params: { groupId: string, meterId: string, registerId: string } },
};

type State = {
  addReadingModal: boolean,
  readingMeterId: string,
  readingRegisterId: string,
};

export class System extends React.Component<Props, State> {
  state = {
    addReadingModal: false,
    readingMeterId: '',
    readingRegisterId: '',
  };

  toggleAddReading() {
    this.setState({
      addReadingModal: !this.state.addReadingModal,
    });
  }

  setAddReading({ meterId, registerId }: { meterId: string, registerId: string }) {
    this.setState({
      addReadingModal: true,
      readingMeterId: meterId,
      readingRegisterId: registerId,
    });
  }

  deleteReading({ groupId, meterId, registerId, readingId }: { groupId: string, meterId: string, registerId: string, readingId: string }) {
    if (confirm('Are you sure?')) {
      this.props.deleteReading({ groupId, meterId, registerId, readingId });
    }
  }

  componentWillMount() {
    const { loadGroupMeters, loadGroup, loadRegisters, group, match: { params: { groupId } } } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
    loadGroupMeters(groupId);
    // for formulaPart
    loadRegisters({ groupId });
  }

  render() {
    const {
      loading,
      meters,
      setGroupMeters,
      registers,
      group,
      updateMeter,
      updateRegister,
      updateFormula,
      addReading,
      realValidationRules,
      virtualValidationRules,
      registerValidationRules,
      readingsValidationRules,
      match: { url, params: { groupId } },
    } = this.props;

    if (meters.status === 404 || meters.status === 403) {
      setGroupMeters({ _status: null, array: [] });
      return <Redirect to="/localpools"/>;
    }

    const breadcrumbs = [
      { id: group.id || 1, link: url, title: group.name },
    ];

    return [

      /* Breadcrumbs */
      <div className="center-content-header" key={ 1 }>
        <Switch>
          <Route path={ `${url}/:meterId` } render={ ({ match: { url: meterUrl, params: { meterId } } }) => {
            const meter = find(meters.array, m => m.id === meterId);
            if (!meter) return <Redirect to={ url }/>;
            breadcrumbs.push({ id: meter.id, type: 'meter', title: meter.productSerialnumber, link: undefined });
            return (
              <Switch>
                <Route path={ `${meterUrl}/registers/:registerId` } render={ ({ match: { params: { registerId } } }) => {
                  const register = find(meter.registers.array, r => r.id === registerId);
                  if (!register) return <Redirect to={ meterUrl }/>;
                  breadcrumbs[1].link = meterUrl;
                  breadcrumbs.push({ id: register.id, type: 'register', title: register.name, link: undefined });
                  return [
                    <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs }/>,
                    <LinkBack key={ 2 } url={ meterUrl } title={ register.name }/>,
                  ];
                } }/>
                <Route path={ `${url}/:meterId` } render={ () => ([
                  <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs }/>,
                  <LinkBack key={ 2 } url={ url } title={ meter.productSerialnumber }/>,
                ])}/>
              </Switch>
            );
          }}/>
          <Route path={ url } render={ () => [
            <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs.concat([{ id: '-----', title: 'System setup' }]) }/>,
            <LinkBack key={ 2 } title="System setup"/>,
          ] }/>
        </Switch>
      </div>,
      /* End of Breadcrumbs */

      <div className="center-content" key={ 2 }>
        <Switch>

          /* Detailed UI */
          <Route path={ `${url}/:meterId` } render={ ({ match: { url: meterUrl, params: { meterId } } }) => {
            const meter = find(meters.array, m => m.id === meterId);
            if (!meter) return <Redirect to={ url }/>;
            return [

              /* Sub nav */
              <Switch key={ 1 }>
                <Route path={ `${meterUrl}/registers/:registerId` } render={ ({ match: { url: registerUrl, params: { registerId } } }) => {
                  const register = find(meter.registers.array, r => r.id === registerId);
                  if (!register) return <Redirect to={ url }/>;
                  return (
                    <Nav className="sub-nav">
                      <NavLink to={ registerUrl } exact className="nav-link">Register data</NavLink>
                      <NavLink to={ `${registerUrl}/readings` } exact className="nav-link">Readings</NavLink>
                    </Nav>
                  );
                } }>
                </Route>
                <Route path={ meterUrl }>
                  <Nav className="sub-nav">
                    <NavLink to={ meterUrl } exact className="nav-link">Meter data</NavLink>
                    {
                      meter.type === 'meter_real' ?
                        <NavLink to={ `${meterUrl}/registers` } className="nav-link">Registers</NavLink> :
                        <NavLink to={ `${meterUrl}/formulas` } className="nav-link">Formulas</NavLink>
                    }
                  </Nav>
                </Route>
              </Switch>,
              /* End of Sub nav */

              /* Main UI */
              <Switch key={ 2 }>
                <Route path={ `${meterUrl}/registers/:registerId` } render={ ({ match: { url: registerUrl, params: { registerId } } }) => {
                  const register = find(meter.registers.array, r => r.id === registerId);
                  if (!register) return <Redirect to={ url }/>;
                  return (
                    <Switch>
                      <Route path={ `${registerUrl}/readings` }>
                        <ReadingsList
                          readings={ register.readings.array }
                          deleteReading={ (readingId) => this.deleteReading({ groupId, meterId: meter.id, registerId: register.id, readingId }) }/>
                      </Route>
                      <Route path={ registerUrl }>
                        <RegisterDataForm {...{
                          updateRegister: params => updateRegister({ groupId, meterId: meter.id, ...params }),
                          register,
                          initialValues: register,
                          validationRules: registerValidationRules,
                        }}/>
                      </Route>
                    </Switch>
                  );
                } }/>
                <Route path={ `${meterUrl}/registers` } render={ () => (
                  <RegistersList
                    registers={ meter.registers.array }
                    meterId={ meter.id }
                    setAddReading={ this.setAddReading.bind(this) }
                    deleteReading={ ({ readingId, registerId }) => this.deleteReading({ groupId, meterId: meter.id, registerId, readingId }) }
                    url={ `${meterUrl}/registers` } />
                ) }/>
                <Route path={ `${meterUrl}/formulas` } render={ () => (
                  <Formulas
                    formulas={ meter.formulaParts.array }
                    registers={ registers.array || [] }
                    updateFormula={ params => updateFormula({ meterId: meter.id, groupId, ...params }) } />
                ) }/>
                <Route path={ meterUrl } render={ () => <MeterDataForm {...{
                  updateMeter: params => updateMeter({ groupId, ...params }),
                  realValidationRules,
                  virtualValidationRules,
                  meter,
                  initialValues: meter,
                }}/> }/>
              </Switch>,
              /* End of Main UI */
            ];
          } }/>
          /* End of Detailed UI */

          /* Meters list */
          <Route path={ url } render={ () => (
            <MetersList {...{
              groupId,
              loading,
              meters: meters.array,
              url,
              setAddReading: this.setAddReading.bind(this),
            }}/>
          ) }/>
          /* End of Meters list */

        </Switch>
      </div>,

      /* Modals */
      <AddReading
        key={ 3 }
        isOpen={ this.state.addReadingModal }
        toggle={ this.toggleAddReading.bind(this) }
        addReading={ params => addReading({
          groupId,
          meterId: this.state.readingMeterId,
          registerId: this.state.readingRegisterId,
          ...params,
        }) }
        validationRules={ readingsValidationRules }
      />,
    ];
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    loading: state.meters.loadingGroupMeters || !state.groups.group.id,
    meters: state.meters.groupMeters,
    registers: state.registers.registers,
    realValidationRules: state.meters.realValidationRules,
    virtualValidationRules: state.meters.virtualValidationRules,
    registerValidationRules: state.registers.validationRules,
    readingsValidationRules: state.readings.validationRules,
  };
}

export default connect(mapStateToProps, {
  loadGroupMeters: Meters.actions.loadGroupMeters,
  setGroupMeters: Meters.actions.setGroupMeters,
  loadGroup: Groups.actions.loadGroup,
  loadRegisters: Registers.actions.loadRegisters,
  updateRegister: Registers.actions.updateRegister,
  updateMeter: Meters.actions.updateMeter,
  updateFormula: Meters.actions.updateFormulaPart,
  addReading: Readings.actions.addReading,
  deleteReading: Readings.actions.deleteReading,
})(System);

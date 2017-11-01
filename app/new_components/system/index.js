// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link, NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import find from 'lodash/find';
import Meters from 'meters';
import Registers from 'registers';
import Groups from 'groups';
import Breadcrumbs from 'new_components/breadcrumbs';
import MetersList from './meters_list';
import MeterDataForm from './meter_data';
import RegistersList from './registers_list';
import RegisterDataForm from './register_data';
import ReadingsList from './readings_list/index';
import Formulas from './formulas';

type Props = {
  loading: boolean,
  meters: Array<Object>,
  registers: Array<Object>,
  readings: Array<Object>,
  group: Object,
  // TODO: replace with action
  loadGroupMeters: Function,
  loadGroup: Function,
  loadRegisters: Function,
  loadRegisterReadings: Function,
  updateMeter: Function,
  updateRegister: Function,
  updateFormula: Function,
  realValidationRules: Object,
  virtualValidationRules: Object,
  registerValidationRules: Object,
  match: { url: string, params: { groupId: string, meterId: string, registerId: string } },
};

export class System extends React.Component<Props> {
  static defaultProps = {
    meters: [],
  };

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
      registers,
      readings,
      group,
      updateMeter,
      updateRegister,
      updateFormula,
      loadRegisterReadings,
      realValidationRules,
      virtualValidationRules,
      registerValidationRules,
      match: { url, params: { groupId } },
    } = this.props;

    if (loading) return (<div>Loading...</div>);

    const breadcrumbs = [
      { id: group.id, link: url, title: group.name },
    ];

    return [

      /* Breadcrumbs */
      <div className="center-content-header" key={ 1 }>
        <Switch>
          <Route path={ `${url}/:meterId` } render={ ({ match: { url: meterUrl, params: { meterId } } }) => {
            const meter = find(meters, m => m.id === meterId);
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
                    <p key={ 2 } className="h4"><Link to={ url }><i className="fa fa-chevron-left"/> { register.name }</Link></p>,
                  ];
                } }/>
                <Route path={ `${url}/:meterId` } render={ () => ([
                  <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs }/>,
                  <p key={ 2 } className="h4"><Link to={ url }><i className="fa fa-chevron-left"/> { meter.productSerialnumber }</Link></p>,
                ])}/>
              </Switch>
            );
          }}/>
          <Route path={ url } render={ () => [
            <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs.concat([{ id: '-----', title: 'System setup' }]) }/>,
            <p key={ 2 } className="h4">System setup</p>,
          ] }/>
        </Switch>
      </div>,
      /* End of Breadcrumbs */

      <div className="center-content" key={ 2 }>
        <Switch>

          /* Detailed UI */
          <Route path={ `${url}/:meterId` } render={ ({ match: { url: meterUrl, params: { meterId } } }) => {
            const meter = find(meters, m => m.id === meterId);
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
                        <ReadingsList readings={ readings } loadRegisterReadings={ () => loadRegisterReadings({ registerId, groupId }) }/>
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
                    readings={ readings }
                    loadRegisterReadings={ registerId => loadRegisterReadings({ registerId, groupId }) }
                    url={ `${meterUrl}/registers` } />
                ) }/>
                <Route path={ `${meterUrl}/formulas` } render={ () => (
                  <Formulas
                    formulas={ meter.formulaParts.array }
                    registers={ registers }
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
          <Route path={ url } render={ () => <MetersList {...{ groupId, loading, meters, url }}/> }/>
          /* End of Meters list */

        </Switch>
      </div>,
    ];
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    loading: state.meters.loadingGroupMeters || !state.groups.group.id,
    meters: state.meters.groupMeters,
    registers: state.registers.registers,
    readings: state.registers.readings,
    realValidationRules: state.meters.realValidationRules,
    virtualValidationRules: state.meters.virtualValidationRules,
    registerValidationRules: state.registers.validationRules,
  };
}

export default connect(mapStateToProps, {
  loadGroupMeters: Meters.actions.loadGroupMeters,
  loadGroup: Groups.actions.loadGroup,
  loadRegisters: Registers.actions.loadRegisters,
  loadRegisterReadings: Registers.actions.loadRegisterReadings,
  updateRegister: Registers.actions.updateRegister,
  updateMeter: Meters.actions.updateMeter,
  updateFormula: Meters.actions.updateFormulaPart,
})(System);

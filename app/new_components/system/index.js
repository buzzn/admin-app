// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link, NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import find from 'lodash/find';
import Meters from 'meters';
import Groups from 'groups';
import Breadcrumbs from 'new_components/breadcrumbs';
import MetersList from './meters_list';
import MeterDataForm from './meter_data';
import RegistersList from './registers_list';

type Props = {
  loading: boolean,
  meters: Array<Object>,
  group: Object,
  // TODO: replace with action
  loadGroupMeters: Function,
  loadGroup: Function,
  updateMeter: Function,
  realValidationRules: Object,
  virtualValidationRules: Object,
  match: { url: string, params: { groupId: string } },
};

export class System extends React.Component<Props> {
  static defaultProps = {
    meters: [],
  };

  componentWillMount() {
    const { loadGroupMeters, loadGroup, group, match: { params: { groupId } } } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
    loadGroupMeters(groupId);
  }

  render() {
    const {
      loading,
      meters,
      group,
      updateMeter,
      realValidationRules,
      virtualValidationRules,
      loadGroupMeters,
      match: { url, params: { groupId } },
    } = this.props;

    if (loading) return (<div>Loading...</div>);

    const breadcrumbs = [
      { id: group.id, link: `/localpools/${group.id}/system`, title: group.name },
    ];

    return [
      <div className="center-content-header" key={ 1 }>
        <Switch>
          <Route path={ `${url}/:meterId` } render={ ({ match: { params: { meterId } } }) => {
            const meter = find(meters, m => m.id === meterId);
            if (!meter) return <Redirect to={ url }/>;
            return [
              <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs.concat([{ id: meter.id, type: 'meter', title: meter.productSerialnumber }]) }/>,
              <p key={ 2 } className="h4"><Link to={ url }><i className="fa fa-chevron-left"/> { meter.productSerialnumber }</Link></p>,
            ];
          }}/>
          <Route path={ url } render={ () => [
            <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs.concat([{ id: '-----', title: 'System setup' }]) }/>,
            <p key={ 2 } className="h4">System setup</p>,
          ] }/>
        </Switch>
      </div>,
      <div className="center-content" key={ 2 }>
        <Switch>
          <Route path={ `${url}/:meterId` } render={ ({ match: { url: meterUrl, params: { meterId } } }) => {
            const meter = find(meters, m => m.id === meterId);
            if (!meter) return <Redirect to={ url }/>;
            return [
              <Nav key={ 1 } className="sub-nav">
                <NavLink to={ meterUrl } exact className="nav-link">Meter data</NavLink>
                <NavLink to={ `${meterUrl}/registers` } className="nav-link">Registers</NavLink>
              </Nav>,
              <Switch key={ 2 }>
                <Route path={ `${meterUrl}/registers` } render={ () => <RegistersList registers={ meter.registers.array } /> }/>
                <Route path={ meterUrl } render={ () => <MeterDataForm {...{
                  updateMeter,
                  realValidationRules,
                  virtualValidationRules,
                  meter,
                  groupId,
                  loadGroupMeters,
                  initialValues: meter,
                }}/> }/>
              </Switch>,
            ];
          } }/>
          <Route path={ url } render={ () => <MetersList {...{ groupId, loading, meters }}/> }/>
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
    realValidationRules: state.meters.realValidationRules,
    virtualValidationRules: state.meters.virtualValidationRules,
  };
}

export default connect(mapStateToProps, {
  loadGroupMeters: Meters.actions.loadGroupMeters,
  loadGroup: Groups.actions.loadGroup,
  updateMeter: Meters.actions.updateMeter,
})(System);

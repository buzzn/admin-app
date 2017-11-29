// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import Meters from 'meters';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';
import LinkBack from 'components/link_back';
import RegistersList from './registers_list';
import RegisterDataForm from './register_data';

type Props = {
  devMode: boolean,
  loading: boolean,
  meters: { _status: null | number, array?: Array<Object> },
  registers: Array<Object>,
  group: Object,
  // TODO: replace with action
  loadGroupMeters: Function,
  setGroupMeters: Function,
  loadGroup: Function,
  match: { url: string, params: { groupId: string, meterId: string, registerId: string } },
};

export class System extends React.Component<Props> {
  componentWillMount() {
    const { loadGroupMeters, loadGroup, group, match: { params: { groupId } } } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
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
      match: { url, params: { groupId } },
    } = this.props;

    if (meters.status === 404 || meters.status === 403) {
      setGroupMeters({ _status: null, array: [] });
      return <Redirect to="/localpools"/>;
    }

    const breadcrumbs = [
      { id: 0, link: '/localpools', title: 'My localpools' },
      { id: group.id || 1, link: url, title: group.name },
    ];

    return (
      <React.Fragment>

        {/* Breadcrumbs */}
        <div className="row center-content-header">
          <div className="col-7">
            <Switch>
              <Route path={ `${url}/:meterId` } render={ ({ match: { url: meterUrl, params: { meterId } } }) => {
                const meter = find(meters.array, m => m.id === meterId);
                if (!meter) return <Redirect to={ url }/>;
                return (
                  <Switch>
                    <Route path={ `${meterUrl}/registers/:registerId` } render={ ({ match: { params: { registerId } } }) => {
                      const register = find(meter.registers.array, r => r.id === registerId);
                      if (!register) return <Redirect to={ meterUrl }/>;
                      breadcrumbs.push({ id: register.id, type: 'register', title: register.name, link: undefined });
                      return (
                        <React.Fragment>
                          <Breadcrumbs breadcrumbs={ breadcrumbs }/>
                          <LinkBack url={ url } title={ register.name }/>
                        </React.Fragment>
                      );
                    } }/>
                  </Switch>
                );
              }}/>
              <Route path={ url } render={ () => (
                <React.Fragment>
                  <Breadcrumbs breadcrumbs={ breadcrumbs.concat([{ id: '-----', title: 'System setup' }]) }/>
                  <LinkBack title="System setup"/>
                </React.Fragment>
              ) }/>
            </Switch>
          </div>
          <div className="col-5">
          </div>
        </div>
        {/* End of Breadcrumbs */}

        <div className="center-content">

          {/* Root sub nav */}
          <Route path={ url } exact render={ () => {
            return (
              <Nav className="sub-nav">
                <NavLink to={ url } exact className="nav-link">Registers</NavLink>
                <NavLink to="#" disabled className="nav-link">To be announced</NavLink>
              </Nav>
            );
          } }/>
          {/* End of root sub nav */}

          <Switch>

            {/* Detailed UI */}
            <Route path={ `${url}/:meterId` } render={ ({ match: { url: meterUrl, params: { meterId } } }) => {
              const meter = find(meters.array, m => m.id === meterId);
              if (!meter) return <Redirect to={ url }/>;
              return (
                <React.Fragment>

                  {/* Sub nav */}
                  {/* End of Sub nav */}

                  {/* Main UI */}
                  <Switch>
                    <Route path={ `${meterUrl}/registers/:registerId` } render={ ({ match: { params: { registerId } } }) => {
                      const register = find(meter.registers.array, r => r.id === registerId);
                      if (!register) return <Redirect to={ url }/>;
                      return (
                        <RegisterDataForm {...{ register, meter, devMode, groupId }}/>
                      );
                    } }/>
                  </Switch>
                  {/* End of Main UI */}
                </React.Fragment>
              );
            } }/>
            {/* End of Detailed UI */}

            {/* Root list */}
            <Route path={ url } render={ ({ history }) => (
              <RegistersList registers={ registers } url={ url } history={ history }/>
            ) }/>
            {/* End of Root list */}

          </Switch>
        </div>

        {/* Modals */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const registers = state.meters.groupMeters._status === 200 ?
    compact(flatten(state.meters.groupMeters.array.map((m) => {
      if (!m.registers) return [];
      return m.registers.array.map(r => ({ ...r, meterId: m.id }));
    }))) :
    [];

  return {
    devMode: state.app.devMode,
    group: state.groups.group,
    loading: state.meters.loadingGroupMeters || !state.groups.group.id,
    meters: state.meters.groupMeters,
    registers,
  };
}

export default connect(mapStateToProps, {
  loadGroupMeters: Meters.actions.loadGroupMeters,
  setGroupMeters: Meters.actions.setGroupMeters,
  loadGroup: Groups.actions.loadGroup,
})(System);

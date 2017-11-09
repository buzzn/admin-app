// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link, NavLink } from 'react-router-dom';
import find from 'lodash/find';
import map from 'lodash/map';
import Contracts from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';
import LinkBack from 'components/link_back';
import PowertakersList from './powertakers_list';
import PowertakerData from './powertaker_data';

type Props = {
  // TODO: replace with action
  loadGroup: Function,
  loadGroupPowertakers: Function,
  setGroupPowertakers: Function,
  powertakers: { _status: null | number, array?: Array<Object> },
  group: Object,
  loading: boolean,
  match: { url: string, params: { groupId: string } },
};

export class Powertakers extends React.Component<Props> {
  componentWillMount() {
    const { loadGroupPowertakers, loadGroup, group, match: { params: { groupId } } } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
    loadGroupPowertakers(groupId);
  }

  render() {
    const { powertakers, setGroupPowertakers, match: { url, params: { groupId } }, loading, group } = this.props;

    if (powertakers.status === 404 || powertakers.status === 403) {
      setGroupPowertakers({ _status: null, array: [] });
      return <Redirect to="/localpools"/>;
    }

    const breadcrumbs = [
      { id: group.id || 1, link: url, title: group.name },
    ];

    return [

      /* Breadcrumbs */
      <div className="center-content-header" key={ 1 }>
        <Switch>
          <Route path={ `${url}/:contractId` } render={ ({ match: { url: powertakerUrl, params: { contractId } } }) => {
            const contract = find(powertakers.array, p => p.id === contractId);
            if (!contract) return <Redirect to={ url }/>;
            breadcrumbs.push({ id: contract.id, type: 'contract', title: contract.customerNumber, link: undefined });
            return [
              <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs }/>,
              <LinkBack key={ 2 } url={ url } title={ contract.customerNumber }/>,
            ];
          } }/>
          <Route path={ url } render={ () => ([
            <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs.concat([{ id: '-----', title: 'Powertakers' }]) }/>,
            <LinkBack key={ 2 } title="Localpool powertakers"/>,
          ]) }/>
        </Switch>
      </div>,
      /* End of Breadcrumbs */

      <div className="center-content" key={ 2 }>
        <Switch>

          /* Detailed UI */
          <Route path={ `${url}/:contractId` } render={ ({ match: { url: powertakerUrl, params: { contractId } } }) => {
            const contract = find(powertakers.array, p => p.id === contractId);
            if (!contract) return <Redirect to={ url }/>;
            return [
              /* Sub nav */
              /* End of sub nav */

              /* Main UI */
              <Switch key={ 2 }>
                <Route path={ powertakerUrl }>
                  <PowertakerData powertaker={ contract.customer }/>
                </Route>
              </Switch>
              /* End of main UI */
            ];
          } }/>
          /* End of detailed UI */

          /* Powertakers List */
          <Route path={ url }>
            <PowertakersList {...{ powertakers: map(powertakers.array, p => ({ ...p.customer, contractId: p.id })), loading, url }}/>
          </Route>
          /* End of powertakers List */

        </Switch>
      </div>,
    ];
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    powertakers: state.contracts.groupPowertakers,
    loading: state.contracts.loadingGroupPowertakers,
  };
}

export default connect(mapStateToProps, {
  loadGroupPowertakers: Contracts.actions.loadGroupPowertakers,
  setGroupPowertakers: Contracts.actions.setGroupPowertakers,
  loadGroup: Groups.actions.loadGroup,
})(Powertakers);

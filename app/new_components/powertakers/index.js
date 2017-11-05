// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link, NavLink } from 'react-router-dom';
import find from 'lodash/find';
import Contracts from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'new_components/breadcrumbs';
import PowertakersList from './powertakers_list';
import PowertakerData from './powertaker_data';

type Props = {
  // TODO: replace with action
  loadGroup: Function,
  loadGroupPowertakers: Function,
  powertakers: Array<Object>,
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
    const { powertakers, match: { url, params: { groupId } }, loading, group } = this.props;

    const breadcrumbs = [
      { id: group.id || 1, link: url, title: group.name },
    ];

    return [

      /* Breadcrumbs */
      <div className="center-content-header" key={ 1 }>
        <Switch>
          <Route path={ `${url}/:contractId` } render={ ({ match: { url: powertakerUrl, params: { contractId } } }) => {
            const contract = find(powertakers, p => p.id === contractId);
            if (!contract) return <Redirect to={ url }/>;
            breadcrumbs.push({ id: contract.id, type: 'contract', title: contract.customerNumber, link: undefined });
            return [
              <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs }/>,
              <p key={ 2 } className="h4"><Link to={ url }><i className="fa fa-chevron-left"/> { contract.customerNumber }</Link></p>
            ];
          } }/>
          <Route path={ url } render={ () => ([
            <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs.concat([{ id: '-----', title: 'Powertakers' }]) }/>,
            <p key={ 2 } className="h4">Localpool powertakers</p>,
          ]) }/>
        </Switch>
      </div>,
      /* End of Breadcrumbs */

      <div className="center-content" key={ 2 }>
        <Switch>

          /* Detailed UI */
          <Route path={ `${url}/:contractId` } render={ ({ match: { url: powertakerUrl, params: { contractId } } }) => {
            const contract = find(powertakers, p => p.id === contractId);
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
            <PowertakersList {...{ powertakers: powertakers.map(p => ({ ...p.customer, contractId: p.id })), loading, url }}/>
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
  loadGroup: Groups.actions.loadGroup,
})(Powertakers);

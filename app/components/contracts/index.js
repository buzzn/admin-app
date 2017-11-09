// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link, NavLink } from 'react-router-dom';
import find from 'lodash/find';
import ContractsModule from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';
import LinkBack from 'components/link_back';
import ContractsList from './contracts_list';
import ContractDataForm from './contract_data';

type Props = {
  // TODO: replace with action
  loadGroup: Function,
  setGroup: Function,
  loadGroupContracts: Function,
  contracts: Array<Object>,
  group: Object,
  loading: boolean,
  match: { url: string, params: { groupId: string } },
};

export class Contracts extends React.Component<Props> {
  componentWillMount() {
    const { loadGroupContracts, loadGroup, group, match: { params: { groupId } } } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
    loadGroupContracts(groupId);
  }

  render() {
    const { contracts, group, setGroup, loading, match: { url, params: { groupId } } } = this.props;

    if (group.status === 404 || group.status === 403) {
      setGroup({ _status: null });
      return <Redirect to="/localpools"/>;
    }

    const breadcrumbs = [
      { id: group.id | 1, link: url, title: group.name },
    ];

    return [

      /* Breadcrumbs */
      <div className="center-content-header" key={ 1 }>
        <Switch>
          <Route path={ `${url}/:contractId` } render={ ({ match: { url: contractUrl, params: { contractId } } }) => {
            const contract = find(contracts, c => c.id === contractId);
            if (!contract) return <Redirect to={ url }/>;
            breadcrumbs.push({ id: contract.id, type: 'contract', title: contract.fullContractNumber });
            return (
              <Switch>
                <Route path={ contractUrl } render={ () => [
                  <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs }/>,
                  <LinkBack key={ 2 } url={ contractUrl } title={ contract.fullContractNumber }/>,
                ] }/>
              </Switch>
            );
          } }/>
          <Route path={ url } render={ () => [
            <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs.concat([{ id: '-----', title: 'Localpool contracts' }]) }/>,
            <LinkBack key={ 2 } title="Localpool contracts"/>,
          ] }/>
        </Switch>
      </div>,
      /* End of Breadcrumbs */

      <div className="center-content" key={ 2 }>
        <Switch>

          /* Detailed UI */
          <Route path={ `${url}/:contractId` } render={ ({ match: { url: contractUrl, params: { contractId } } }) => {
            const contract = find(contracts, c => c.id === contractId);
            if (!contract) return <Redirect to={ url }/>;
            return [

              /* Sub nav */
              /* End of sub nav */

              /* Main UI */
              <Switch key={ 2 }>
                <Route path={ contractUrl }>
                  <ContractDataForm {...{
                    // TODO: real validation rules and updateContract action
                    validationRules: {},
                    contract,
                    initialValues: contract,
                  }}/>
                </Route>
              </Switch>
              /* End of main UI */

            ];
          } }/>
          /* End of detailed UI */

          /* Contracts list */
          <Route path={ url }>
            <ContractsList {...{
              contracts,
              url,
              loading,
            }}/>
          </Route>
          /* End of contracts list */

        </Switch>
      </div>,
    ];
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    contracts: state.contracts.groupContracts,
    loading: state.contracts.loadingGroupContracts,
  };
}

export default connect(mapStateToProps, {
  loadGroupContracts: ContractsModule.actions.loadGroupContracts,
  loadGroup: Groups.actions.loadGroup,
  setGroup: Groups.actions.setGroup,
})(Contracts);

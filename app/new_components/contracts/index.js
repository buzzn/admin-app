// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link, NavLink } from 'react-router-dom';
import find from 'lodash/find';
import ContractsModule from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'new_components/breadcrumbs';
import ContractsList from './contracts_list';
import ContractDataForm from './contract_data';

type Props = {
  // TODO: replace with action
  loadGroup: Function,
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
    const { contracts, group, loading, match: { url, params: { groupId } } } = this.props;

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
                  <p key={ 2 } className="h4"><Link to={ contractUrl }><i className="fa fa-chevron-left"/> { contract.fullContractNumber }</Link></p>,
                ] }/>
              </Switch>
            );
          } }/>
          <Route path={ url } render={ () => [
            <Breadcrumbs key={ 1 } breadcrumbs={ breadcrumbs.concat([{ id: '-----', title: 'Localpool contracts' }]) }/>,
            <p key={ 2 } className="h4">Localpool contracts</p>,
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
})(Contracts);

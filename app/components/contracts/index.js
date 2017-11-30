// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
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
      return <Redirect to="/groups"/>;
    }

    const breadcrumbs = [
      { id: 0, link: '/groups', title: 'My groups' },
      { id: group.id | 1, link: url, title: group.name },
    ];

    return (
      <React.Fragment>

        {/* Breadcrumbs */}
        <div className="row center-content-header">
          <div className="col-7">
            <Switch>
              <Route path={ `${url}/:contractId` } render={ ({ match: { url: contractUrl, params: { contractId } } }) => {
                const contract = find(contracts, c => c.id === contractId);
                if (!contract) return <Redirect to={ url }/>;
                breadcrumbs.push({ id: contract.id, type: 'contract', title: contract.fullContractNumber });
                return (
                  <Switch>
                    <Route path={ contractUrl } render={ () => (
                      <React.Fragment>
                        <Breadcrumbs breadcrumbs={ breadcrumbs }/>
                        <LinkBack url={ contractUrl } title={ contract.fullContractNumber }/>
                      </React.Fragment>
                    ) }/>
                  </Switch>
                );
              } }/>
              <Route path={ url } render={ () => (
                <React.Fragment>
                  <Breadcrumbs breadcrumbs={ breadcrumbs.concat([{ id: '-----', title: 'Localpool contracts' }]) }/>
                  <LinkBack title="Localpool contracts"/>
                </React.Fragment>
              ) }/>
            </Switch>
          </div>
          <div className="col-5">
          </div>
        </div>
        {/* End of Breadcrumbs */}

        <div className="center-content">
          <Switch>

            {/* Detailed UI */}
            <Route path={ `${url}/:contractId` } render={ ({ match: { url: contractUrl, params: { contractId } } }) => {
              const contract = find(contracts, c => c.id === contractId);
              if (!contract) return <Redirect to={ url }/>;
              return (
                <React.Fragment>
                  {/* Sub nav */}
                  {/* End of sub nav */}

                  {/* Main UI */}
                  <Switch>
                    <Route path={ contractUrl }>
                      <ContractDataForm {...{
                        // TODO: real validation rules and updateContract action
                        validationRules: {},
                        contract,
                        initialValues: contract,
                      }}/>
                    </Route>
                  </Switch>
                  {/* End of main UI */}
                </React.Fragment>
              );
            } }/>
            {/* End of detailed UI */}

            {/* Contracts list */}
            <Route path={ url }>
              <ContractsList {...{
                contracts,
                url,
                loading,
              }}/>
            </Route>
            {/* End of contracts list */}

          </Switch>
        </div>

      </React.Fragment>
    );
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

import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import find from 'lodash/find';
import ContractsModule from 'contracts';
import Groups from 'groups';
import PageTitle from 'components/page_title';
import ContractsList from './contracts_list';

export class Documents extends React.Component {
  componentDidMount() {
    const {
      loadGroupContracts,
      loadGroup,
      group,
      match: { params: { groupId } },
    } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
    loadGroupContracts(groupId);
  }

  render() {
    const {
      contracts,
      getContractPDFData,
      attachContractPDF,
      generateContractPDF,
      deleteContractPDF,
      loadGroupContracts,
      group,
      setGroup,
      loading,
      match: {
        url,
        params: { groupId },
      },
    } = this.props;

    if (group.status === 404 || group.status === 403) {
      setGroup({ _status: null });
      return <Redirect to="/groups" />;
    }

    const breadcrumbs = [
      { id: 0, link: '/groups', title: 'My groups' },
      { id: group.id || 1, link: url, title: group.name },
    ];

    return (
      <Switch>
        <Route path={url}>
          <ContractsList
            {...{
              breadcrumbs,
              contracts,
              url,
              loading,
              getContractPDFData,
              attachContractPDF,
              generateContractPDF,
              deleteContractPDF,
              loadGroupContracts,
              groupId,
            }}
          />
        </Route>
      </Switch>
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
  getContractPDFData: ContractsModule.actions.getContractPDFData,
  attachContractPDF: ContractsModule.actions.attachContractPDF,
  generateContractPDF: ContractsModule.actions.generateContractPDF,
  deleteContractPDF: ContractsModule.actions.deleteContractPDF,
  loadGroup: Groups.actions.loadGroup,
  setGroup: Groups.actions.setGroup,
})(Documents);

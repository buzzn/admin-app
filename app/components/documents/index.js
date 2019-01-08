import * as React from 'react';
import { connect } from 'react-redux';
import { getFormSubmitErrors, formValueSelector } from 'redux-form';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ContractsModule from 'contracts';
import Groups from 'groups';
import PageTitle from 'components/page_title';
import { CenterContent, SubNav } from 'components/style';
import ContractsList from './contracts_list';

export class Documents extends React.Component {
  componentDidMount() {
    const {
      loadGroupContracts,
      loadGroup,
      match: { params: { groupId } },
    } = this.props;
    loadGroup(groupId);
    loadGroupContracts(groupId);
  }

  render() {
    const {
      contracts,
      addContract,
      getContractPDFData,
      attachContractPDF,
      generateContractPDF,
      deleteContractPDF,
      loadGroupContracts,
      addContractFormName,
      addContractType,
      addContractErrors,
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
      { id: '-----', title: 'Documents' },
    ];

    return (
      <>
        <PageTitle
          {...{
            breadcrumbs,
            title: 'Documents',
          }}
        />
        <CenterContent>
          <SubNav>
            <NavLink to={`${url}/bills`} exact className="nav-link">
              <FormattedMessage id="admin.contracts.navBills" />
            </NavLink>
            <NavLink to={`${url}/contracts`} exact className="nav-link">
              <FormattedMessage id="admin.contracts.navContracts" />
            </NavLink>
            <NavLink to={`${url}/bureaucracy`} exact className="nav-link">
              <FormattedMessage id="admin.contracts.navBureaucracy" />
            </NavLink>
          </SubNav>
          <Switch>
            <Route path={`${url}/bills`} render={() => <div>Bills</div>} />
            <Route path={`${url}/contracts`}>
              <ContractsList
                {...{
                  breadcrumbs,
                  contracts,
                  url,
                  loading,
                  addContract,
                  getContractPDFData,
                  attachContractPDF,
                  generateContractPDF,
                  deleteContractPDF,
                  loadGroupContracts,
                  addContractFormName,
                  addContractType,
                  addContractErrors,
                  groupId,
                  group,
                }}
              />
            </Route>
            <Route path={`${url}/bureaucracy`} render={() => <div>Bureaucracy</div>} />
            <Route path={url}>
              <Redirect to={`${url}/contracts`} />
            </Route>
          </Switch>
        </CenterContent>
      </>
    );
  }
}

const addContractFormName = 'addContract';
const addContractSelector = formValueSelector(addContractFormName);

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    contracts: state.contracts.groupContracts,
    loading: state.contracts.loadingGroupContracts || state.groups.loadingGroup,
    addContractFormName,
    addContractType: addContractSelector(state, 'type'),
    addContractErrors: getFormSubmitErrors(addContractFormName)(state),
  };
}

export default connect(
  mapStateToProps,
  {
    loadGroupContracts: ContractsModule.actions.loadGroupContracts,
    getContractPDFData: ContractsModule.actions.getContractPDFData,
    attachContractPDF: ContractsModule.actions.attachContractPDF,
    generateContractPDF: ContractsModule.actions.generateContractPDF,
    deleteContractPDF: ContractsModule.actions.deleteContractPDF,
    addContract: ContractsModule.actions.addContract,
    loadGroup: Groups.actions.loadGroup,
    setGroup: Groups.actions.setGroup,
  },
)(Documents);

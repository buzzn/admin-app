import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import find from 'lodash/find';
import truncate from 'lodash/truncate';
import get from 'lodash/get';
import Contracts from 'contracts';
import Groups from 'groups';
import Users from 'users';
import Organizations from 'organizations';
import Loading from 'components/loading';
import PowertakersList from './powertakers_list';
import PowertakerData from './powertaker_data';
import ContractData from './contract_data';
import AddPowertaker from './add_powertaker';

export class Powertakers extends React.Component {
  componentDidMount() {
    const {
      loadGroupPowertakers,
      loadGroup,
      match: { params: { groupId } },
    } = this.props;
    loadGroup(groupId);
    loadGroupPowertakers(groupId);
  }

  componentWillUnmount() {
    this.props.setGroupPowertakers({ _status: null, array: [] });
  }

  render() {
    const {
      intl,
      powertakers,
      setGroupPowertakers,
      loadAvailableUsers,
      availableUsers,
      loadAvailableOrganizations,
      availableOrganizations,
      validationRules,
      history,
      match: {
        url,
        params: { groupId },
      },
      loading,
      group,
      addContract,
    } = this.props;

    if (powertakers._status === 404 || powertakers._status === 403) {
      setGroupPowertakers({ _status: null, array: [] });
      return <Redirect to="/groups" />;
    }

    if (powertakers._status === null || loading) return <Loading minHeight={40} />;

    const breadcrumbs = [
      { id: 0, link: '/groups', title: intl.formatMessage({ id: 'admin.groups.breadcrumbsMyLocalpools' }) },
      { id: group.id || 1, link: url, title: group.name },
    ];

    return (
      <Switch>
        <Route
          path={`${url}/:pType(active|past)`}
          render={({ match: { params: { pType } } }) => (
            <PowertakersList
              active
              {...{
                breadcrumbs,
                pType,
                powertakers: powertakers.array,
                loading,
                group,
                url,
                history,
              }}
            />
          )}
        />
        <Route path={`${url}/add-powertaker`}>
          <AddPowertaker
            {...{
              history,
              url,
              loadAvailableUsers,
              availableUsers,
              loadAvailableOrganizations,
              availableOrganizations,
              addContract: params => addContract({ groupId, ...params }),
              validationRules,
            }}
          />
        </Route>
        <Route
          path={`${url}/:contractId`}
          render={({
            match: {
              url: contractUrl,
              params: { contractId },
            },
          }) => {
            const contract = find(powertakers.array, p => p.id === contractId);
            if (!contract) return <Redirect to={url} />;
            const powertaker = contract.customer || {};
            const powertakerTitle = powertaker.type === 'person' ? `${powertaker.firstName} ${powertaker.lastName}` : powertaker.name;
            breadcrumbs.push({
              id: contract.id,
              type: 'contract',
              title: contract.fullContractNumber,
              link: undefined,
            });
            return (
              <Switch>
                <Route path={`${contractUrl}/powertaker`}>
                  <PowertakerData
                    {...{
                      // FIXME: temporary workaround for organizations
                      powertaker: get(contract.customer, 'type') === 'organization' ? contract.customer : null,
                      userId: get(contract.customer, 'type') === 'person' ? contract.customer.id : null,
                      groupId,
                      url,
                      history,
                      breadcrumbs,
                      title: truncate(powertakerTitle || '', 20),
                    }}
                  />
                </Route>
                <Route path={contractUrl}>
                  <ContractData {...{ breadcrumbs, title: contract.fullContractNumber, groupId, contractId, url }} />
                </Route>
              </Switch>
            );
          }}
        />
        <Route path={url}>
          <Redirect to={`${url}/active`} />
        </Route>
      </Switch>
    );
  }
}

function mapStateToProps(state) {
  return {
    group: state.groups.group,
    powertakers: state.contracts.groupPowertakers,
    loading: state.contracts.loadingGroupPowertakers,
    availableUsers: state.users.availableUsers,
    availableOrganizations: state.organizations.availableOrganizations,
    validationRules: state.contracts.validationRules,
  };
}

export default connect(
  mapStateToProps,
  {
    loadGroupPowertakers: Contracts.actions.loadGroupPowertakers,
    setGroupPowertakers: Contracts.actions.setGroupPowertakers,
    addContract: Contracts.actions.addContract,
    loadGroup: Groups.actions.loadGroup,
    loadAvailableUsers: Users.actions.loadAvailableUsers,
    loadAvailableOrganizations: Organizations.actions.loadAvailableOrganizations,
  },
)(injectIntl(Powertakers));

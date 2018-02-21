import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Nav } from 'reactstrap';
import find from 'lodash/find';
import truncate from 'lodash/truncate';
import get from 'lodash/get';
import Contracts from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';
import LinkBack from 'components/link_back';
import Loading from 'components/loading';
import PowertakersList from './powertakers_list';
import PowertakerData from './powertaker_data';
import ContractData from './contract_data';

export class Powertakers extends React.Component {
  componentWillMount() {
    const { loadGroupPowertakers, loadGroup, group, match: { params: { groupId } } } = this.props;
    loadGroup(groupId);
    loadGroupPowertakers(groupId);
  }

  componentWillUnmount() {
    this.props.setGroupPowertakers({ _status: null, array: [] });
  }

  render() {
    const { intl, powertakers, setGroupPowertakers, match: { url, params: { groupId } }, loading, group } = this.props;

    if (powertakers._status === 404 || powertakers._status === 403) {
      setGroupPowertakers({ _status: null, array: [] });
      return <Redirect to="/groups" />;
    }

    if (powertakers._status === null || loading) return <Loading minHeight={40} />;

    const breadcrumbs = [
      { id: 0, link: '/groups', title: 'My groups' },
      { id: group.id || 1, link: url, title: group.name },
    ];

    return (
      <Switch>
        <Route
          path={`${url}/:pType(active|past)`}
          render={({ history, match: { params: { pType } } }) => (
            <PowertakersList
              active
              {...{
                breadcrumbs,
                pType,
                powertakers: powertakers.array,
                loading,
                groupId,
                url,
                history,
              }}
            />
          )}
        />
        <Route
          path={`${url}/:contractId`}
          render={({ history, match: { url: contractUrl, params: { contractId } } }) => {
            const contract = find(powertakers.array, p => p.id === contractId);
            if (!contract) return <Redirect to={url} />;
            const powertaker = contract.customer;
            const powertakerTitle =
              powertaker.type === 'person' ? `${powertaker.firstName} ${powertaker.lastName}` : powertaker.name;
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
                      title: truncate(powertakerTitle, 20),
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
  };
}

export default connect(mapStateToProps, {
  loadGroupPowertakers: Contracts.actions.loadGroupPowertakers,
  setGroupPowertakers: Contracts.actions.setGroupPowertakers,
  loadGroup: Groups.actions.loadGroup,
})(injectIntl(Powertakers));

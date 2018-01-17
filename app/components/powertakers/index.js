import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Nav } from 'reactstrap';
import find from 'lodash/find';
import Contracts from 'contracts';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';
import LinkBack from 'components/link_back';
import PowertakersList from './powertakers_list';
import PowertakerData from './powertaker_data';

export class Powertakers extends React.Component {
  componentWillMount() {
    const { loadGroupPowertakers, loadGroup, group, match: { params: { groupId } } } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
    loadGroupPowertakers(groupId);
  }

  render() {
    const { powertakers, setGroupPowertakers, match: { url, params: { groupId } }, loading, group } = this.props;

    if (powertakers.status === 404 || powertakers.status === 403) {
      setGroupPowertakers({ _status: null, array: [] });
      return <Redirect to="/groups" />;
    }

    const breadcrumbs = [
      { id: 0, link: '/groups', title: 'My groups' },
      { id: group.id || 1, link: url, title: group.name },
    ];

    return (
      <React.Fragment>
        {/* Breadcrumbs */}
        <div className="row center-content-header">
          <div className="col-7">
            <Switch>
              <Route
                path={`${url}/:pType(active|past)`}
                render={() => (
                  <React.Fragment>
                    <Breadcrumbs breadcrumbs={breadcrumbs.concat([{ id: '-----', title: 'Powertakers' }])} />
                    <LinkBack title="Localpool powertakers" />
                  </React.Fragment>
                )}
              />
              <Route
                path={`${url}/:contractId`}
                render={({ match: { url: powertakerUrl, params: { contractId } } }) => {
                  const contract = find(powertakers.array, p => p.id === contractId);
                  if (!contract) return <Redirect to={url} />;
                  breadcrumbs.push({
                    id: contract.id,
                    type: 'contract',
                    title: contract.customerNumber,
                    link: undefined,
                  });
                  return (
                    <React.Fragment>
                      <Breadcrumbs breadcrumbs={breadcrumbs} />
                      <LinkBack url={url} title={contract.customerNumber} />
                    </React.Fragment>
                  );
                }}
              />
            </Switch>
          </div>
          <div className="col-5" />
        </div>
        {/* End of Breadcrumbs */}

        <div className="center-content">
          <Switch>
            <Route path={url} exact>
              <Redirect to={`${url}/active`} />
            </Route>

            {/* Powertakers List */}
            <Route path={`${url}/:pType(active|past)`}>
              <React.Fragment>
                {/* Sub nav */}
                <Nav className="sub-nav">
                  <NavLink to={`${url}/active`} exact className="nav-link">
                    <FormattedMessage id="!!changeId!!.activePowertakers" />
                  </NavLink>
                  <NavLink to={`${url}/past`} exact className="nav-link">
                    <FormattedMessage id="!!changeId!!.pastPowertakers" />
                  </NavLink>
                </Nav>
                {/* End of sub nav */}

                <Switch>
                  <Route
                    path={`${url}/active`}
                    render={() => <PowertakersList active {...{ powertakers: powertakers.array, loading, url }} />}
                  />
                  <Route
                    path={`${url}/past`}
                    render={() => <PowertakersList {...{ powertakers: powertakers.array, loading, url }} />}
                  />
                </Switch>
              </React.Fragment>
            </Route>
            {/* End of powertakers List */}

            {/* Detailed UI */}
            <Route
              path={`${url}/:contractId`}
              render={({ match: { url: powertakerUrl, params: { contractId } } }) => {
                const contract = find(powertakers.array, p => p.id === contractId);
                if (!contract) return <Redirect to={url} />;
                return (
                  <React.Fragment>
                    {/* Sub nav */}
                    {/* End of sub nav */}

                    {/* Main UI */}
                    <Switch>
                      <Route path={powertakerUrl}>
                        <PowertakerData powertaker={contract.customer} />
                      </Route>
                    </Switch>
                    {/* End of main UI */}
                  </React.Fragment>
                );
              }}
            />
            {/* End of detailed UI */}
          </Switch>
        </div>
      </React.Fragment>
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
})(Powertakers);

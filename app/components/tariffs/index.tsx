import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, NavLink, RouteComponentProps } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Nav } from 'reactstrap';
import { Col } from 'reactstrap';
import get from 'lodash/get';
import Groups from 'groups';
import Breadcrumbs from 'components/breadcrumbs';
import LinkBack from 'components/link_back';
import Loading from 'components/loading';
import TariffsList from './tariffs_list';

class Tariffs extends React.Component<StateProps & DispatchProps & ExtProps & InjectedIntlProps> {
  componentWillMount() {
    const { loadGroup, match: { params: { groupId } } } = this.props;
    loadGroup(groupId);
  }

  render() {
    const { loading, intl, group, setGroup, match: { url, params: { groupId } } } = this.props;

    if (group._status === 404 || group._status === 403) {
      setGroup({ _status: null });
      return <Redirect to="/groups" />;
    }

    const breadcrumbs = [
      { id: 0, link: '/groups', title: intl.formatMessage({ id: 'admin.breadcumbs.myGroups' }) },
      { id: group.id || 1, link: url, title: group.name },
    ];

    const prefix = 'admin.tariffs';

    const tariffs = get(group, 'tariffs.array', []);

    return (
      <React.Fragment>
        {/* Breadcrumbs */}
        <div className="row center-content-header">
          <Col sm="7">
            <Switch>
              <Route
                path={`${url}/:pType(active|past)`}
                render={() => (
                  <React.Fragment>
                    <Breadcrumbs
                      breadcrumbs={breadcrumbs.concat([
                        { id: '-----', title: intl.formatMessage({ id: 'admin.breadcumbs.tariffs' }), link: null },
                      ])}
                    />
                    <LinkBack title={intl.formatMessage({ id: `${prefix}.backTariffs` })} url={null} />
                  </React.Fragment>
                )}
              />
            </Switch>
          </Col>
          <Col sm="5" />
        </div>
        {/* End of Breadcrumbs */}

        <div className="center-content">
          <Switch>
            <Route path={url} exact>
              <Redirect to={`${url}/active`} />
            </Route>

            {/* Tariffs List */}
            <Route path={`${url}/:pType(active|past)`}>
              {loading ? (
                <Loading minHeight={40} />
              ) : (
                <React.Fragment>
                  {/* Sub nav */}
                  <Nav className="sub-nav">
                    <NavLink to={`${url}/active`} exact className="nav-link">
                      <FormattedMessage id={`${prefix}.navActiveTariffs`} />
                    </NavLink>
                    <NavLink to={`${url}/past`} exact className="nav-link">
                      <FormattedMessage id={`${prefix}.navPastTariffs`} />
                    </NavLink>
                  </Nav>
                  {/* End of sub nav */}

                  <Switch>
                    <Route path={`${url}/active`} render={() => <TariffsList active {...{ tariffs, groupId }} />} />
                    <Route path={`${url}/past`} render={() => <TariffsList {...{ tariffs, groupId }} />} />
                  </Switch>
                </React.Fragment>
              )}
            </Route>
            {/* End of tariffs List */}
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

interface TariffsRouterProps {
  groupId: string;
}

interface ExtProps extends RouteComponentProps<TariffsRouterProps> {}

// FIXME: put it to groups types
interface StatePart {
  groups: {
    loadingGroup: boolean;
    group: { _status: null | number; [key: string]: any };
  };
}

interface StateProps {
  loading: boolean;
  group: { _status: null | number; [key: string]: any };
}

interface DispatchProps {
  loadGroup: Function;
  setGroup: Function;
}

function mapStateToProps(state: StatePart) {
  return {
    loading: state.groups.loadingGroup,
    group: state.groups.group,
  };
}

export default connect<StateProps, DispatchProps, ExtProps>(mapStateToProps, {
  loadGroup: Groups.actions.loadGroup,
  setGroup: Groups.actions.setGroup,
})(injectIntl(Tariffs));

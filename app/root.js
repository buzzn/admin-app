// @flow
import 'buzzn-style';
import 'react-table/react-table.css';
import 'react-widgets/dist/css/react-widgets.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';
import './root.scss';

import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import type { MapStateToProps } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Alert from 'react-s-alert';
import PartErrorBoundary from 'components/part_error_boundary';
import TopNavBarContainer from 'components/top_nav_bar';
import SignInContainer from 'components/sign_in';
import Sidebar from 'components/sidebar';
import LocalpoolsListContainer from 'components/localpools_list';
import TodoList from 'components/todo_list';
import AnalyticsContainer from 'components/analytics';
import PowertakersContainer from 'components/powertakers';
import ContractsContainer from 'components/contracts';
import SystemContainer from 'components/system';
import GroupSettingsContainer from 'components/group_settings';
import BubblesContainer from 'components/bubbles';
import HealthContainer from 'components/health';
import './react_table_config';

type Props = {
  token?: string,
  devMode: boolean,
};

const NewRoot = ({ token, devMode }: Props) => (
  <BrowserRouter>
    <div className={ `new-ui ${!token ? 'no-token' : ''}` }>
      <HealthContainer/>
      { token && <TopNavBarContainer devMode={ devMode }/> }
      { token ?
        <Container style={{ maxWidth: '1440px' }}>
          <Route exact path="/" render={ () => <Redirect to="/groups"/> } />
          <Row>

            <Route path="/groups/:groupId" render={ ({ match: { url } }) => (
              <Col xs="1" className="pl-0 pr-0">
                <Sidebar url={ url || '' } devMode={ devMode }/>
              </Col>
            ) }/>

            <Route path="/*" render={ ({ match: { url } }) =>
              <Col xs={ (url === '/' || url === '/groups') ? '9' : '8' } className="pl-0 pr-0">
                <div className="center-content-wrapper">
                  <PartErrorBoundary part="main-part">
                    <Switch>
                      <Route path="/groups/:groupId/analytics" component={ AnalyticsContainer }/>
                      <Route path="/groups/:groupId/powertakers" component={ PowertakersContainer }/>
                      <Route path="/groups/:groupId/contracts" component={ ContractsContainer }/>
                      <Route path="/groups/:groupId/system" component={ SystemContainer }/>
                      <Route path="/groups/:groupId/bubbles" component={ BubblesContainer }/>
                      <Route path="/groups/:groupId/settings" component={ GroupSettingsContainer }/>
                      <Route
                        path="/groups/:groupId"
                        render={ ({ match: { params: { groupId } } }) => <Redirect to={ `/groups/${groupId || ''}/settings` }/> }/>
                      <Route path="/groups" component={ LocalpoolsListContainer }/>
                      <Route render={ () => (<div>404</div>) } />
                    </Switch>
                  </PartErrorBoundary>
                </div>
              </Col>
            }/>

            <Col xs="3" className="pl-0 pr-0">
              <TodoList devMode={ devMode }/>
            </Col>

          </Row>
        </Container> :
        <Route component={ SignInContainer } />
      }
      <Alert stack={{ limit: 3 }} effect="genie" html={ true } />
    </div>
  </BrowserRouter>
);

const mapStateToProps: MapStateToProps<*, *, *> = state => ({ token: state.auth.token, devMode: state.app.devMode });

export default connect(mapStateToProps)(NewRoot);

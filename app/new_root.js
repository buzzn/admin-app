// @flow
import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import type { MapStateToProps } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import PartErrorBoundary from 'new_components/part_error_boundary';
import TopNavBarContainer from 'new_components/top_nav_bar';
import SignInContainer from 'new_components/sign_in';
import Sidebar from 'new_components/sidebar';
import LocalpoolsListContainer from 'new_components/localpools_list';
import TodoList from 'new_components/todo_list';
import AnalyticsContainer from 'new_components/analytics';
import PowertakersContainer from 'new_components/powertakers';
import ContractsContainer from 'new_components/contracts';
import SystemContainer from 'new_components/system';
import HealthContainer from './new_components/health';
import './react_table_config';

import 'buzzn-style';
import 'react-table/react-table.css';
import 'react-widgets/dist/css/react-widgets.css';
import './new_root.scss';

type Props = {
  token?: string,
};

const NewRoot = ({ token }: Props) => (
  <BrowserRouter>
    <div className="new-ui">
      <HealthContainer/>
      { token && <TopNavBarContainer/> }
      { token ?
        <Container style={{ maxWidth: '1440px' }}>
          <Route exact path="/" render={ () => <Redirect to="/localpools"/> } />
          <Row>

            <Route path="/localpools/:groupId" render={ ({ match: { params: { groupId } } }) => (
              <Col xs="1" className="pl-0 pr-0">
                <Sidebar groupId={ groupId || '' }/>
              </Col>
            ) }/>

            <Route path="/*" render={ ({ match: { url } }) =>
              <Col xs={ (url === '/' || url === '/localpools') ? '9' : '8' } className="pl-0 pr-0">
                <div className="center-content-wrapper">
                  <PartErrorBoundary part="main-part">
                    <Switch>
                      <Route path="/localpools/:groupId/analytics" component={ AnalyticsContainer }/>
                      <Route path="/localpools/:groupId/powertakers" component={ PowertakersContainer }/>
                      <Route path="/localpools/:groupId/contracts" component={ ContractsContainer }/>
                      <Route path="/localpools/:groupId/system" component={ SystemContainer }/>
                      <Route path="/localpools/*" render={ () => <div>Content</div> }/>
                      <Route path="/localpools" component={ LocalpoolsListContainer }/>
                      <Route render={ () => (<div>404</div>) } />
                    </Switch>
                  </PartErrorBoundary>
                </div>
              </Col>
            }/>

            <Col xs="3" className="pl-0 pr-0">
              <TodoList/>
            </Col>

          </Row>
        </Container> :
        <Container>
          <Route component={ SignInContainer } />
        </Container>
      }
    </div>
  </BrowserRouter>
);

const mapStateToProps: MapStateToProps<*, *, *> = state => ({ token: state.auth.token });

export default connect(mapStateToProps)(NewRoot);
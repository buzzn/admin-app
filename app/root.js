import 'buzzn-style';
import 'react-table/react-table.css';
import 'react-widgets/dist/css/react-widgets.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';
import './root.scss';

import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Alert from 'react-s-alert';
import Transition from 'react-transition-group/Transition';
import PartErrorBoundary from 'components/part_error_boundary';
import ScrollToTop from 'components/scroll_to_top';
import TopNavBarContainer from 'components/top_nav_bar';
import SignInContainer from 'components/sign_in';
import Sidebar from 'components/sidebar';
import LocalpoolsListContainer from 'components/localpools_list';
import TodoList from 'components/todo_list';
import AnalyticsContainer from 'components/analytics';
import PowertakersContainer from 'components/powertakers';
import TariffsContainer from 'components/tariffs';
import BillingContainer from 'components/billing';
import ContractsContainer from 'components/contracts';
import SystemContainer from 'components/system';
import GroupSettingsContainer from 'components/group_settings';
import BubblesContainer from 'components/bubbles';
import HealthContainer from 'components/health';
import Footer from 'components/footer';
import { EditOverlay } from 'style';
import './react_table_config';

export const EditOverlayContext = React.createContext();


// FIXME: react router old context api hack. See react-router#5901, react-router#6072, react#12551, react#12586
const RouterHack = ({ token, devMode, multiGroups, editMode, switchEditMode }) => (
  <EditOverlayContext.Provider value={{ editMode, switchEditMode }}>
    {token && <TopNavBarContainer devMode={devMode} />}
    {token ? (
      <Container style={{ maxWidth: '1440px' }}>
        <Route exact path="/" render={() => <Redirect to="/groups" />} />
        <Row>
          <Route
            path="/groups/:groupId"
            render={({ match: { url } }) => <Sidebar url={url || ''} devMode={devMode} multiGroups={multiGroups} />}
          />

          <Route
            path="/*"
            render={({ match: { url } }) => (
              <Col xs={url === '/' || url === '/groups' ? '9' : '8'} className="pl-0 pr-0">
                <div className="center-content-wrapper">
                  <PartErrorBoundary part="main-part">
                    <Switch>
                      <Route path="/groups/:groupId/analytics" component={AnalyticsContainer} />
                      <Route path="/groups/:groupId/powertakers" component={PowertakersContainer} />
                      <Route path="/groups/:groupId/tariffs" component={TariffsContainer} />
                      <Route path="/groups/:groupId/billing" component={BillingContainer} />
                      <Route path="/groups/:groupId/contracts" component={ContractsContainer} />
                      <Route path="/groups/:groupId/system" component={SystemContainer} />
                      <Route path="/groups/:groupId/bubbles" component={BubblesContainer} />
                      <Route path="/groups/:groupId/settings" component={GroupSettingsContainer} />
                      <Route
                        path="/groups/:groupId"
                        render={({ match: { params: { groupId } } }) => (
                          <Redirect to={`/groups/${groupId || ''}/settings`} />
                        )}
                      />
                      <Route path="/groups" component={LocalpoolsListContainer} />
                      <Route render={() => <div>404</div>} />
                    </Switch>
                  </PartErrorBoundary>
                </div>
              </Col>
            )}
          />

          <Col xs="3" className="pl-0 pr-0">
            <TodoList devMode={devMode} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Footer />
          </Col>
        </Row>
      </Container>
    ) : (
      <Route component={SignInContainer} />
    )}
  </EditOverlayContext.Provider>
);

class NewRoot extends React.Component {
  state = { editMode: false };

  switchEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  };

  render() {
    const { token, devMode, multiGroups } = this.props;
    const { editMode } = this.state;

    return (
      <BrowserRouter>
        <ScrollToTop>
          <div className={`new-ui ${!token ? 'no-token' : ''}`}>
            <HealthContainer />
            <Transition in={(editMode && !!token)} timeout={{ enter: 0, exit: 300 }} mountOnEnter unmountOnExit>
              {(state) => {
                const defaultStyle = { transition: 'opacity 300ms ease-in-out', opacity: 0 };
                const transitions = { entering: { opacity: 0 }, entered: { opacity: 0.8 }, exiting: { cursor: 'auto' }, exited: { opacity: 0 } };
                return (
                  <EditOverlay style={{ ...defaultStyle, ...transitions[state] }} />
                );
              }}
            </Transition>


            <RouterHack {...{ token, devMode, multiGroups, editMode, switchEditMode: this.switchEditMode }} />
            <Alert stack={{ limit: 3 }} effect="genie" html={true} offset={72} />
          </div>
        </ScrollToTop>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  devMode: state.app.ui.devMode,
  multiGroups: !!state.groups.groups.array.length,
});

export default connect(mapStateToProps)(NewRoot);

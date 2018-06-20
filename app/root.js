import 'buzzn-style';
import 'react-table/react-table.css';
import 'react-widgets/dist/css/react-widgets.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './root.scss';

import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Alert from 'react-s-alert';
import Transition from 'react-transition-group/Transition';
import Groups from 'groups';
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
import DocumentsContainer from 'components/documents';
import SystemContainer from 'components/system';
import GroupSettingsContainer from 'components/group_settings';
import BubblesContainer from 'components/bubbles';
import HealthContainer from 'components/health';
import Footer from 'components/footer';
import AppLoading from 'components/app_loading';
import AppMaintenance from 'components/app_maintenance';
import AddGroup from 'components/add_group';
import { EditOverlay } from 'style';
import './react_table_config';

export const EditOverlayContext = React.createContext();

// FIXME: react router old context api hack. See react-router#5901, react-router#6072, react#12551, react#12586
const RouterHack = ({ token, devMode, multiGroups, editMode, switchEditMode, addGroupOpen, switchAddGroup, addGroup }) => (
  <EditOverlayContext.Provider value={{ editMode, switchEditMode }}>
    {token && <TopNavBarContainer {...{ devMode, switchAddGroup }} />}
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
                      <Route path="/groups/:groupId/market-locations" component={SystemContainer} />
                      <Route path="/groups/:groupId/documents" component={DocumentsContainer} />
                      <Route path="/groups/:groupId/bubbles" component={BubblesContainer} />
                      <Route path="/groups/:groupId/settings" component={GroupSettingsContainer} />
                      <Route
                        path="/groups/:groupId"
                        render={({ match: { params: { groupId } } }) => <Redirect to={`/groups/${groupId || ''}/settings`} />}
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
            <AddGroup
              {...{
                isOpen: addGroupOpen,
                toggle: switchAddGroup,
                onSubmit: addGroup,
              }}
            />
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
  state = { editMode: false, addGroupOpen: false };

  switchEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  };

  switchAddGroup = () => {
    this.setState({ addGroupOpen: !this.state.addGroupOpen });
  };

  addGroup = (values) => {
    const { addGroup } = this.props;
    const params = { ...values };

    // Country is always predefined, so if there is only one address field,
    // user did not entered anything in address fields
    if (Object.keys(values.address).length === 1) delete params.address;

    return new Promise((resolve, reject) => {
      addGroup({ resolve, reject, params });
    }).then(() => {
      Alert.success('Saved!');
      this.switchAddGroup();
    });
  };

  render() {
    const {
      token,
      devMode,
      multiGroups,
      appLoading,
      health,
      groupValidationRules,
    } = this.props;
    const { editMode, addGroupOpen } = this.state;

    return (
      <React.Fragment>
        {appLoading ? (
          <AppLoading />
        ) : (
          <BrowserRouter>
            <ScrollToTop>
              <div className={`new-ui ${!token ? 'no-token' : ''}`}>
                <HealthContainer />
                <Transition in={editMode && !!token} timeout={{ enter: 0, exit: 300 }} mountOnEnter unmountOnExit>
                  {(state) => {
                    const defaultStyle = { transition: 'opacity 300ms ease-in-out', opacity: 0 };
                    const transitions = {
                      entering: { opacity: 0 },
                      entered: { opacity: 0.8 },
                      exiting: { cursor: 'auto' },
                      exited: { opacity: 0 },
                    };
                    return <EditOverlay style={{ ...defaultStyle, ...transitions[state] }} />;
                  }}
                </Transition>

                {(health.healthy && health.maintenance === 'off') ? (
                  <RouterHack {...{
                    token,
                    devMode,
                    multiGroups,
                    editMode,
                    switchEditMode: this.switchEditMode,
                    addGroupOpen,
                    groupValidationRules,
                    switchAddGroup: this.switchAddGroup,
                    addGroup: this.addGroup,
                  }} />
                ) : (
                  <AppMaintenance />
                )}

                <Alert stack={{ limit: 3 }} effect="slide" html={true} offset={72} timeout={5000} />
              </div>
            </ScrollToTop>
          </BrowserRouter>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  devMode: state.app.ui.devMode,
  multiGroups: !!state.groups.groups.array.length,
  appLoading: state.app.appLoading,
  health: state.app.health,
});

export default connect(mapStateToProps, {
  addGroup: Groups.actions.addGroup,
})(NewRoot);

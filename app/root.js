import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import TopNavBarContainer from './components/top_nav_bar';
import SignInContainer from './components/sign_in';
import Groups from './groups';
import GroupOverview from './components/group_overview';
import PowertakerOverview from './components/powertaker_overview';
import GroupNavBarContainer from './components/group_nav_bar';
import PowertakerNavBarContainer from './components/powertaker_nav_bar';
import GroupResources from './components/group_resources';
import PowertakerResources from './components/powertaker_resources';

import './root.scss';

const Root = ({ token }) => (
  <BrowserRouter>
    <div>
      <TopNavBarContainer signedIn={ !!token } />
      { token ?
        <div className="container">
          <div className="top-part">
            <Route exact path="/" component={ Groups.ListConnected } pathPrefix="groups" />
            <Switch>
              <Route path="/groups/:groupId/powertakers/:userId" component={ PowertakerOverview } />
              <Route path="/groups/:groupId" component={ GroupOverview } />
              <Route render={ () => (<div>404</div>) } />
            </Switch>
          </div>
          <div className="navigation">
            <Switch>
              <Route path="/groups/:groupId/powertakers/:userId" component={ PowertakerNavBarContainer } />
              <Route path="/groups/:groupId" component={ GroupNavBarContainer } />
            </Switch>
          </div>
          <div className="bottom-part">
            <Switch>
              <Route path="/groups/:groupId/powertakers/:userId" component={ PowertakerResources } />
              <Route path="/groups/:groupId" component={ GroupResources } />
            </Switch>
          </div>
        </div> :
        <div className="container">
          <Route component={ SignInContainer } />
        </div>
      }
    </div>
  </BrowserRouter>
);

function mapStateToProps(state) {
  return { token: state.auth.token };
}

export default connect(mapStateToProps)(Root);

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import TopNavBarContainer from './components/top_nav_bar';

import SignInContainer from './components/sign_in';
import Groups from './groups';

import GroupOverview from './components/group_overview';
import GroupNavBarContainer from './components/group_nav_bar';
import GroupResources from './components/group_resources';

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
              <Route path="/groups/:groupId" component={ GroupOverview } />
              <Route render={ () => (<div>404</div>) } />
            </Switch>
          </div>
          <div className="navigation">
            <Route path="/groups/:groupId" component={ GroupNavBarContainer } />
          </div>
          <div className="bottom-part">
            <Route path="/groups/:groupId" component={ GroupResources } />
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

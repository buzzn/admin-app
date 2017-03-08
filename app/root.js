import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import TopNavBarContainer from './components/top_nav_bar';
import SignInContainer from './components/sign_in';
import HomeContainer from './components/home';
import LocalpoolOverview from './components/localpool_overview';
import PowertakerOverview from './components/powertaker_overview';
import LocalpoolNavBarContainer from './components/localpool_nav_bar';
import PowertakerNavBarContainer from './components/powertaker_nav_bar';
import LocalpoolResources from './components/localpool_resources';
import PowertakerResources from './components/powertaker_resources';

import './root.scss';

const Root = ({ token }) => (
  <BrowserRouter>
    <div>
      <TopNavBarContainer signedIn={ !!token } />
      { token ?
        <div className="container">
          <div className="top-part row">
            <div className="col-12">
              <Switch>
                <Route exact path="/" component={ HomeContainer } />
                <Route path="/localpools/:groupId/powertakers/:userId" component={ PowertakerOverview } />
                <Route path="/localpools/:groupId" component={ LocalpoolOverview } />
                <Route render={ () => (<div>404</div>) } />
              </Switch>
            </div>
          </div>
          <div className="navigation row">
            <div className="col-12">
              <Switch>
                <Route path="/localpools/:groupId/powertakers/:userId" component={ PowertakerNavBarContainer } />
                <Route path="/localpools/:groupId" component={ LocalpoolNavBarContainer } />
              </Switch>
            </div>
          </div>
          <div className="bottom-part row">
            <div className="col-12">
              <Switch>
                <Route path="/localpools/:groupId/powertakers/:userId" component={ PowertakerResources } />
                <Route path="/localpools/:groupId" component={ LocalpoolResources } />
              </Switch>
            </div>
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

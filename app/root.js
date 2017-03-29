import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import TopNavBarContainer from 'components/top_nav_bar';
import SignInContainer from 'components/sign_in';
import HomeContainer from 'components/home';
import LocalpoolOverviewContainer from 'components/localpool/overview';
import PowertakerOverviewContainer from 'components/powertaker/overview';
import ContractOverviewContainer from 'components/contract/overview';
import ContractingPartyOverviewContainer from 'components/contracting_party/overview';
import MeterOverviewContainer from 'components/meter/overview';
import RegisterOverviewContainer from 'components/register/overview';
import LocalpoolNavBarContainer from 'components/localpool/nav_bar';
import PowertakerNavBarContainer from 'components/powertaker/nav_bar';
import ContractNavBarContainer from 'components/contract/nav_bar';
import ContractingPartyNavBarContainer from 'components/contracting_party/nav_bar';
import MeterNavBar from 'components/meter/nav_bar';
import LocalpoolResources from 'components/localpool/resources';
import PowertakerResources from 'components/powertaker/resources';
import ContractResources from 'components/contract/resources';
import ContractingPartyResourcesContainer from 'components/contracting_party/resources';
import MeterResources from 'components/meter/resources';
import RegisterResourcesContainer from 'components/register/resources';

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
                <Route path="/localpools/:groupId/powertakers/:userId" component={ PowertakerOverviewContainer } />
                <Route path="/localpools/:groupId/contracts/:contractId/:partyType/show" component={ ContractingPartyOverviewContainer } />
                <Route path="/localpools/:groupId/contracts/:contractId" component={ ContractOverviewContainer } />
                <Route path="/localpools/:groupId/system/:meterId/registers/:registerId" component={ RegisterOverviewContainer } />
                <Route path="/localpools/:groupId/system/:meterId" component={ MeterOverviewContainer } />
                <Route path="/localpools/:groupId" component={ LocalpoolOverviewContainer } />
                <Route render={ () => (<div>404</div>) } />
              </Switch>
            </div>
          </div>
          <div className="navigation row">
            <div className="col-12">
              <Switch>
                <Route path="/localpools/:groupId/powertakers/:userId" component={ PowertakerNavBarContainer } />
                <Route path="/localpools/:groupId/contracts/:contractId/:partyType/show" component={ ContractingPartyNavBarContainer } />
                <Route path="/localpools/:groupId/contracts/:contractId" component={ ContractNavBarContainer } />
                <Route path="/localpools/:groupId/system/:meterId" component={ MeterNavBar } />
                <Route path="/localpools/:groupId" component={ LocalpoolNavBarContainer } />
              </Switch>
            </div>
          </div>
          <div className="bottom-part row">
            <div className="col-12">
              <Switch>
                <Route path="/localpools/:groupId/powertakers/:userId" component={ PowertakerResources } />
                <Route path="/localpools/:groupId/contracts/:contractId/:partyType/show" component={ ContractingPartyResourcesContainer } />
                <Route path="/localpools/:groupId/contracts/:contractId" component={ ContractResources } />
                <Route path="/localpools/:groupId/system/:meterId/registers/:registerId" component={ RegisterResourcesContainer } />
                <Route path="/localpools/:groupId/system/:meterId" component={ MeterResources } />
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

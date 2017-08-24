import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import './react_table_config';
import PartErrorBoundary from 'components/part_error_boundary';
import RowRoute from 'components/row_route';
import TopNavBarContainer from 'components/top_nav_bar';
import SignInContainer from 'components/sign_in';
import HomeContainer from 'components/home';
import LocalpoolOverviewContainer from 'components/localpool/overview';
import PowertakerOverviewContainer from 'components/powertaker/overview';
import ContractOverviewContainer from 'components/contract/overview';
import ContractingPartyOverviewContainer from 'components/contracting_party/overview';
import TariffOverviewContainer from 'components/tariff/overview';
import MeterOverviewContainer from 'components/meter/overview';
import RegisterOverviewContainer from 'components/register/overview';
import FormulaOverviewContainer from 'components/formula/overview';
import MyProfileOverviewContainer from 'components/my_profile/overview';
import LocalpoolNavBarContainer from 'components/localpool/nav_bar';
import PowertakerNavBarContainer from 'components/powertaker/nav_bar';
import ContractNavBarContainer from 'components/contract/nav_bar';
import ContractingPartyNavBarContainer from 'components/contracting_party/nav_bar';
import MeterNavBarContainer from 'components/meter/nav_bar';
import RegisterNavBar from 'components/register/nav_bar';
import MyProfileNavBar from 'components/my_profile/nav_bar';
import LocalpoolResources from 'components/localpool/resources';
import PowertakerResources from 'components/powertaker/resources';
import ContractResources from 'components/contract/resources';
import ContractingPartyResourcesContainer from 'components/contracting_party/resources';
import MeterResources from 'components/meter/resources';
import RegisterResourcesContainer from 'components/register/resources';
import MyProfileResourcesContainer from 'components/my_profile/resources';

import 'buzzn-style';
import 'react-table/react-table.css';
import 'react-widgets/dist/css/react-widgets.css';
import './root.scss';

const Root = ({ token }) => (
  <BrowserRouter>
    <div>
      <TopNavBarContainer signedIn={ !!token } />
      { token ?
        <div className="container">
          <PartErrorBoundary part="top-part">
            <div className="top-part row">
              <div className="col-12">
                <Switch>
                  <Route exact path="/" component={ HomeContainer } />
                  <Route path="/my-profile" component={ MyProfileOverviewContainer } />
                  <Route path="/localpools/:groupId/powertakers/:contractId/tariffs/:tariffId" render={ props => <TariffOverviewContainer { ...props } view="powertaker" /> } />
                  <Route path="/localpools/:groupId/powertakers/:contractId" component={ PowertakerOverviewContainer } />
                  <Route path="/localpools/:groupId/contracts/:contractId/tariffs/:tariffId" component={ TariffOverviewContainer } />
                  <Route path="/localpools/:groupId/contracts/:contractId/:partyType/show" component={ ContractingPartyOverviewContainer } />
                  <Route path="/localpools/:groupId/contracts/:contractId" component={ ContractOverviewContainer } />
                  <Route path="/localpools/:groupId/system/:meterId/formulas/:formulaId" component={ FormulaOverviewContainer } />
                  <Route path="/localpools/:groupId/system/:meterId/registers/:registerId" component={ RegisterOverviewContainer } />
                  <Route path="/localpools/:groupId/system/:meterId" component={ MeterOverviewContainer } />
                  <Route path="/localpools/:groupId" component={ LocalpoolOverviewContainer } />
                  <Route render={ () => (<div>404</div>) } />
                </Switch>
              </div>
            </div>
          </PartErrorBoundary>
          <PartErrorBoundary part="navigation">
            <Switch>
              <RowRoute rowClass="navigation" path="/my-profile" component={ MyProfileNavBar } />
              <RowRoute hide={ true } path="/localpools/:groupId/powertakers/:contractId/tariffs/:tariffId" />
              <RowRoute rowClass="navigation" path="/localpools/:groupId/powertakers/:contractId" component={ PowertakerNavBarContainer } />
              <RowRoute hide={ true } path="/localpools/:groupId/contracts/:contractId/tariffs/:tariffId" />
              <RowRoute rowClass="navigation" path="/localpools/:groupId/contracts/:contractId/:partyType/show" component={ ContractingPartyNavBarContainer } />
              <RowRoute rowClass="navigation" path="/localpools/:groupId/contracts/:contractId" component={ ContractNavBarContainer } />
              <RowRoute hide={ true } path="/localpools/:groupId/system/:meterId/formulas/:formulaId" />
              <RowRoute rowClass="navigation" path="/localpools/:groupId/system/:meterId/registers/:registerId" component={ RegisterNavBar } />
              <RowRoute rowClass="navigation" path="/localpools/:groupId/system/:meterId" component={ MeterNavBarContainer } />
              <RowRoute rowClass="navigation" path="/localpools/:groupId" component={ LocalpoolNavBarContainer } />
            </Switch>
          </PartErrorBoundary>
          <PartErrorBoundary part="bottom-part">
            <Switch>
              <RowRoute rowClass="bottom-part" path="/my-profile" component={ MyProfileResourcesContainer } />
              <RowRoute hide={ true } path="/localpools/:groupId/powertakers/:contractId/tariffs/:tariffId" />
              <RowRoute rowClass="bottom-part" path="/localpools/:groupId/powertakers/:contractId" component={ PowertakerResources } />
              <RowRoute hide={ true } path="/localpools/:groupId/contracts/:contractId/tariffs/:tariffId" />
              <RowRoute rowClass="bottom-part" path="/localpools/:groupId/contracts/:contractId/:partyType/show" component={ ContractingPartyResourcesContainer } />
              <RowRoute rowClass="bottom-part" path="/localpools/:groupId/contracts/:contractId" component={ ContractResources } />
              <RowRoute hide={ true } path="/localpools/:groupId/system/:meterId/formulas/:formulaId" />
              <RowRoute rowClass="bottom-part" path="/localpools/:groupId/system/:meterId/registers/:registerId" component={ RegisterResourcesContainer } />
              <RowRoute rowClass="bottom-part" path="/localpools/:groupId/system/:meterId" component={ MeterResources } />
              <RowRoute rowClass="bottom-part" path="/localpools/:groupId" component={ LocalpoolResources } />
            </Switch>
          </PartErrorBoundary>
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

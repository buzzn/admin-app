import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import Organizations from 'organizations';

import OrganizationsList from './organizations_list';
import AddOrganization from './add_organization';

const OrganizationMarkets = ({
  addOrganizationMarket,
  updateOrganizationMarket,
  addFunctionToOrgMarket,
  updateOrganizationMarketFunction,
  deleteFunctionFromOrgMarket,
  availableOrganizationMarkets,
  loadAvailableOrganizationMarkets,
  loading,
  history,
  match: { url },
  validationRules,
}) => {
  useEffect(() => {
    loadAvailableOrganizationMarkets();
  }, []);

  return (
    <Switch>
      <Route path={url} exact>
        <OrganizationsList
          {...{
            availableOrganizationMarkets,
            loading,
            urlAdd: `${url}/add-organization`,
            validationRules,
            updateOrganizationMarket,
            addFunctionToOrgMarket,
            updateOrganizationMarketFunction,
            deleteFunctionFromOrgMarket,
          }}
        />
      </Route>
      <Route path={`${url}/add-organization`}>
        <AddOrganization
          {...{ addOrganizationMarket, history, validationRules: validationRules.orgMarketCreate, url }}
        />
      </Route>
    </Switch>
  );
};

function mapStateToProps(state) {
  return {
    availableOrganizationMarkets: state.organizations.availableOrganizationMarkets,
    loading: state.organizations.loadingAvailableOrganizationMarkets,
    validationRules: state.organizations.validationRules,
  };
}

export default connect(
  mapStateToProps,
  {
    addOrganizationMarket: Organizations.actions.addOrganizationMarket,
    updateOrganizationMarket: Organizations.actions.updateOrganizationMarket,
    addFunctionToOrgMarket: Organizations.actions.addFunctionToOrgMarket,
    updateOrganizationMarketFunction: Organizations.actions.updateOrganizationMarketFunction,
    deleteFunctionFromOrgMarket: Organizations.actions.deleteFunctionFromOrgMarket,
    loadAvailableOrganizationMarkets: Organizations.actions.loadAvailableOrganizationMarkets,
  },
)(OrganizationMarkets);

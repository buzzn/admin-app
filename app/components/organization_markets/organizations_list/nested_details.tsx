import React, { useState } from 'react';
import get from 'lodash/get';
import { reduxForm } from 'redux-form';
import Alert from 'react-s-alert';

import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import { NestedDetailsWrapper, ActionItem } from 'components/style';

import MarketFunction from './market_function';
import AddFunction from './add_function';

const NestedDetails = ({
  reset,
  handleSubmit,
  organization,
  validationRules,
  updateOrganizationMarketFunction,
  updateOrganizationMarket,
  addFunctionToOrgMarket,
  deleteFunctionFromOrgMarket,
}) => {
  const prefix = 'admin.organizations';

  const [editMode, setEditMode] = useState(false);
  const [addFunction, setAddFunction] = useState(false);

  const submit = params => new Promise((resolve, reject) => {
    updateOrganizationMarket({ resolve, reject, params, organizationId: organization.id });
  }).then(() => {
    Alert.success('Saved');
  });

  return (
    <NestedDetailsWrapper>
      <form onSubmit={handleSubmit(submit)}>
        {!editMode && <i className="buzzn-pencil float-right" onClick={() => setEditMode(true)} />}
        <br />
        {['name', 'description', 'phone', 'website', 'email'].map(name => (
          <TwoColField
            {...{
              key: name,
              prefix,
              name,
              editMode,
              withLabel: true,
              validationRules: validationRules.orgMarketUpdate,
              component: EditableInput,
            }}
          />
        ))}
        {editMode && (
          <React.Fragment>
            <button className="btn btn-primary" onClick={() => handleSubmit(submit)}>
              Save
            </button>
            <button
              className="btn btn-link"
              onClick={() => {
                reset();
                setEditMode(false);
              }}
            >
              Cancel
            </button>
          </React.Fragment>
        )}
      </form>
      {addFunction ? (
        <AddFunction
          {...{
            addFunctionToOrgMarket,
            cancel: () => setAddFunction(false),
            form: `addMarketFunctionTo${organization.id}`,
            organizationId: organization.id,
            validationRules: validationRules.orgMarketAddFunction,
          }}
        />
      ) : (
        <React.Fragment>
          <ActionItem className="add" onClick={() => setAddFunction(true)}>
            Add function <i className="fa fa-plus" />
          </ActionItem>
          <br />
        </React.Fragment>
      )}
      {get(organization, 'marketFunctions.array', []).map(marketFunction => (
        <MarketFunction
          {...{
            key: marketFunction.id,
            form: `editMarketFunction${marketFunction.id}`,
            marketFunction,
            organizationId: organization.id,
            initialValues: marketFunction,
            validationRules: validationRules.marketFunctionUpdate,
            updateOrganizationMarketFunction,
            deleteFunctionFromOrgMarket,
          }}
        />
      ))}
    </NestedDetailsWrapper>
  );
};

export default reduxForm({ enableReinitialize: true })(NestedDetails);

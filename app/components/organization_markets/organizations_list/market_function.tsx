import React, { useState } from 'react';
import { Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import Alert from 'react-s-alert';

import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';

import { MarketFunctionWrap } from './style';

const MarketFunction = ({
  reset,
  handleSubmit,
  organizationId,
  marketFunction,
  validationRules,
  updateOrganizationMarketFunction,
  deleteFunctionFromOrgMarket,
}) => {
  const prefix = 'admin.organizations';

  const [editMode, setEditMode] = useState(false);

  const submit = params => new Promise((resolve, reject) => {
    updateOrganizationMarketFunction({ resolve, reject, params, organizationId, functionId: marketFunction.id });
  }).then(() => {
    Alert.success('Saved');
  });

  return (
    <MarketFunctionWrap>
      <Col xs={12}>
        <form onSubmit={handleSubmit(submit)}>
          {!editMode && (
            <React.Fragment>
              <i
                className="fa fa-remove float-right"
                onClick={() => confirm('Are you sure?')
                  && deleteFunctionFromOrgMarket({ organizationId, functionId: marketFunction.id })
                }
              />
              <i className="buzzn-pencil float-right" onClick={() => setEditMode(true)} />
            </React.Fragment>
          )}
          <br />
          {['function', 'marketPartnerId', 'edifactEmail'].map(name => (
            <TwoColField
              {...{
                key: name,
                prefix,
                name,
                editMode,
                withLabel: true,
                validationRules,
                component: validationRules[name].enum ? EditableSelect : EditableInput,
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
      </Col>
    </MarketFunctionWrap>
  );
};

export default reduxForm({ enableReinitialize: true })(MarketFunction);

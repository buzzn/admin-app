import React from 'react';
import { Col } from 'reactstrap';
import Alert from 'react-s-alert';
import { reduxForm } from 'redux-form';

import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableSelect from 'components/editable_select';

import { MarketFunctionWrap } from './style';

const AddFunction = ({ addFunctionToOrgMarket, cancel, handleSubmit, organizationId, validationRules }) => {
  const prefix = 'admin.organizations';

  const submit = params => new Promise((resolve, reject) => {
    addFunctionToOrgMarket({ resolve, reject, params, organizationId });
  }).then(() => {
    Alert.success('Saved');
  });

  return (
    <MarketFunctionWrap>
      <Col xs={12}>
        <form onSubmit={handleSubmit(submit)}>
          {['function', 'marketPartnerId', 'edifactEmail'].map(name => (
            <TwoColField
              {...{
                key: name,
                prefix,
                name,
                editMode: true,
                withLabel: true,
                validationRules,
                component: validationRules[name].enum ? EditableSelect : EditableInput,
              }}
            />
          ))}
          <button className="btn btn-primary" onClick={() => handleSubmit(submit)}>
            Save
          </button>
          <button
            className="btn btn-link"
            onClick={() => {
              cancel();
            }}
          >
            Cancel
          </button>
        </form>
      </Col>
    </MarketFunctionWrap>
  );
};

export default reduxForm({ enableReinitialize: true })(AddFunction);

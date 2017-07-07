import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { fieldValidator } from 'validation_functions';

const TwoColField = props => (
  <div className="row">
    <div className="col-6">
      <FormattedMessage id={ `${props.prefix}.${props.name}` } />
    </div>
    <div className="col-6">
      <Field
        { ...props }
        field={ props.field || props.validationRules[props.name] }
        validate={ fieldValidator(props.validationRules[props.name]) }
      />
    </div>
  </div>
);

export default TwoColField;

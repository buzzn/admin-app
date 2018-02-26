import * as React from 'react';
import { FormGroup } from 'components/style';

const FieldInput = ({ label, input, meta: { touched, error } }) => (
  <FormGroup className={`form-group ${touched && error && 'has-danger'}`}>
    <input className={`form-control ${touched && error && 'form-control-danger'}`} {...input} type="text" />
    <label>{label}</label>
    {touched && error && <div className="form-control-feedback">{error}</div>}
  </FormGroup>
);

export default FieldInput;

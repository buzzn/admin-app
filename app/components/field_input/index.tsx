import * as React from 'react';
import { FormGroup } from 'components/style';

const FieldInput = ({ label, input, meta: { active, touched, error } }) => (
  <FormGroup className={`form-group ${touched && error && 'has-danger'}`}>
    <input id={input.name} className={`form-control ${touched && error && 'form-control-danger'}`} {...input} type="text" />
    <label className={`${!!input.value || active ? 'top' : 'center'}`} htmlFor={input.name}>{label}</label>
    {touched && error && <div className="form-control-feedback">{error}</div>}
  </FormGroup>
);

export default FieldInput;

// @flow
import React from 'react';
import type { FormProps } from 'redux-form';

import './style.scss';

type Props = {
  submitForm: Function,
  className?: string,
} & FormProps;

const FieldToggle = ({ input, submitForm, className, meta: { touched, error } }: Props) => {
  return (
    <span className={ `field-toggle ${(touched && error) && 'has-danger'} ${className}` }>
      <span
        className={ `field-toggle-switch ${input.value ? 'on' : 'off'}` }
        onClick={ () => { input.onChange(!input.value); setTimeout(submitForm, 200); } } />
      { touched && error && <span className="form-control-feedback">{ error }</span> }
    </span>
  );
};

export default FieldToggle;

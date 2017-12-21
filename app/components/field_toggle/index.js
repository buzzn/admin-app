import React from 'react';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

import './style.scss';

const FieldToggle = ({ input, dispatch, formName, className, meta: { touched, error } }) => {
  return (
    <span className={ `field-toggle ${(touched && error) && 'has-danger'} ${className}` }>
      <span
        className={ `field-toggle-switch ${input.value ? 'on' : 'off'}` }
        onClick={ () => { input.onChange(!input.value); setTimeout(dispatch(submit(formName))); } } />
      { touched && error && <span className="form-control-feedback">{ error }</span> }
    </span>
  );
};

export default connect()(FieldToggle);

import React from 'react';

import './style.scss';

const FieldToggle = ({ input, submitForm, className, meta: { touched, error } }) => (
    <span className={`field-toggle ${touched && error && 'has-danger'} ${className}`}>
      <span
        className={`field-toggle-switch ${input.value ? 'on' : 'off'}`}
        // FIXME: it's an "official" feature/bug. Please check git issues for setTimeout. Fix this "200" when possible.
        onClick={() => {
          input.onChange(!input.value);
          setTimeout(submitForm, 200);
        }}
      />
      {touched && error && <span className="form-control-feedback">{error}</span>}
    </span>
);

export default FieldToggle;

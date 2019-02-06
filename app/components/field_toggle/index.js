import React from 'react';

import { FieldToggleWrapper } from './style';

const FieldToggle = ({ input, submitForm, className, meta: { touched, error, submitting } }) => (
  <FieldToggleWrapper className={`field-toggle ${touched && error && 'has-danger'} ${className} ${submitting && 'submitting'}`}>
    <span
      className={`field-toggle-switch ${input.value ? 'on' : 'off'}`}
      // FIXME: it's an "official" feature/bug. Please check git issues for setTimeout. Fix this "200" when possible.
      onClick={() => {
        if (submitting) return;
        input.onChange(!input.value);
        setTimeout(submitForm, 200);
      }}
    />
    {touched && error && <span className="form-control-feedback">{error}</span>}
  </FieldToggleWrapper>
);

export default FieldToggle;

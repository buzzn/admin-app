import React from 'react';
import { FormattedMessage } from 'react-intl';

const EditableCheckbox = ({ prefix, name, withLabel, editMode, input, meta: { touched, error } }) => (
  <div className={`editable-checkbox form-check custom-control$ custom-checkbox$ ${touched && error && 'has-danger'}`}>
    <input
      className={`custom-control-input$ form-check-input ${!withLabel && 'position-static'}`}
      id={input.name}
      {...input}
      disabled={!editMode}
      defaultChecked={input.value}
      onBlur={({ target }) => input.onBlur(target.value.checked)}
      type="checkbox"
    />
    {withLabel && (
      <label className="custom-control-label" htmlFor={input.name}>
        <FormattedMessage id={`${prefix}.${name || input.name.split('.').pop()}`} />
      </label>
    )}
    {touched && error && <div className="invalid-feedback" style={{ display: 'inline' }}>{error}</div>}
  </div>
);

export default EditableCheckbox;
